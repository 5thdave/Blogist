import hmac
import secrets
from flask import Blueprint, jsonify,session,request
from werkzeug.security import check_password_hash, generate_password_hash
from pkg.models import db,Post,User
from flask_httpauth import HTTPBasicAuth

api = Blueprint('api',__name__)

auth = HTTPBasicAuth()

def verify_user_password(user, password):
    stored_password = user.password_hash
    if stored_password.startswith(("scrypt:", "pbkdf2:")) and stored_password.count("$") == 2:
        return check_password_hash(stored_password, password)

    if hmac.compare_digest(stored_password.encode("utf-8"), password.encode("utf-8")):
        user.password_hash = generate_password_hash(password)
        db.session.commit()
        return True
    return False

@auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    return user is not None and verify_user_password(user, password)

@auth.error_handler
def unauthorized(error):
    return jsonify({
        "status":"failure",
        "message":"You are not authenticated",
        "data":{}
    })
    
@api.route('/register/',methods=['POST'])
def register():
    if request.method == 'POST' and request.is_json:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if username != None and email != None and password != None:
            uname = db.session.query(User).filter(User.username == username).first()
            email_addr = db.session.query(User).filter(User.email == email).first()
            if uname:
                return jsonify({
                    "status":"failure",
                    "message":"Username Already Exist",
                    "data":{} 
                }),400 
            if email_addr:
                return jsonify({
                    "status":"failure",
                    "message":"Email Already Exist",
                    "data":{} 
                }),400
            password_hash = generate_password_hash(password)
            user = User(username=username,email=email,password_hash=password_hash)
            db.session.add(user)
            db.session.commit()
            return jsonify({
                "status":"success",
                "message":"Successful",
                "data":{}
            }),201
        else:
            return jsonify({
                "status":"failure",
                "message":"Email Already Exist",
                "data":{} 
            }),400
    else:
        return jsonify({
           "status":"failure",
            "message":"Request type shoild be POST and data should be JSON",
            "data":{} 
        }),400

@api.route('/login/',methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({
            "status":"failure",
            "message":"Request type should be POST and data should be JSON",
            "data":{}
        }),400

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({
            "status":"failure",
            "message":"Request data must be a JSON object",
            "data":{}
        }),400

    username = data.get('username')
    password = data.get('password')
    if not isinstance(username, str) or not username.strip() or not isinstance(password, str) or not password:
        return jsonify({
            "status":"failure",
            "message":"Username and password are required",
            "data":{}
        }),400

    user = User.query.filter_by(username=username).first()
    if user is None or not verify_user_password(user, password):
        return jsonify({
            "status":"failure",
            "message":"Invalid username or password",
            "data":{}
        }),401

    session['useronline'] = user.id
    return jsonify({
        "status":"success",
        "message":"Login successful",
        "data":{
            "user_id":user.id,
            "username":user.username
        }
    }),200
    
@api.route('/logout/', methods=['GET', 'POST'])
def logout():
    session.clear()
    return jsonify({
        "status":"success",
        "message":"Logout successful",
        "data":{}
    }),200

@api.route('/post/all/')

def api_posts():
    posts = db.session.query(Post).all()
    my_posts = []
    for i in posts:
        post_dict = {}
        post_dict['post_id'] = i.id
        post_dict['post_title'] = i.title
        post_dict['post_content'] = i.content
        post_dict['post_image'] = f'http://127.0.0.1:5000/static/uploads/{i.image}'
        post_dict['post_created_at'] = i.created_at
        my_posts.append(post_dict)
    if my_posts:
        return jsonify({
                "status":"success",
                "message":"Posts fetched Successfully",
                "data":my_posts
            }),200
    else:
        return jsonify({
                "status":"success",
                "message":"No Post Yet",
                "data":{}
            }),200
    
@api.route('/post/single/<int:post_id>')
# @auth.login_required
def post_single(post_id):
    post = db.session.query(Post).get(int(post_id))
    
    if post:
        post_dict = {}
        post_dict['post_id'] = post.id
        post_dict['post_title'] = post.title
        post_dict['post_content'] = post.content
        post_dict['post_image'] = f'http://127.0.0.1:5000/static/uploads/{post.image}'
        post_dict['post_created_at'] = post.created_at
        return jsonify({
                "status":"success",
                "message":"Posts fetched Successfully",
                "data":post_dict
            }),200
    else:
        return jsonify({
                "status":"failure",
                "message":"No Post Yet",
                "data":{}
            }),404
        
@api.route('/post/create/',methods=['POST'])
def post_create():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json() or {}
            title = data.get('title')
            content = data.get('content')
            image = None
        else:
            title = request.form.get('title')
            content = request.form.get('content')
            image = request.files.get('image')

        if not title or not content:
            return jsonify({
                "status":"failure",
                "message":"Title and Content is required",
                "data":{}
            }),400

        if image and hasattr(image, 'filename') and image.filename:
            filename = image.filename
            ext = filename.rsplit('.', 1)[-1] if '.' in filename else 'jpg'
            generated = secrets.token_hex(24)
            new_filename = f'{generated}.{ext}'
            upload_path = f'pkg/static/uploads/{new_filename}'
            image.save(upload_path)
            post = Post(title=title,content=content,image=new_filename)
            db.session.add(post)
            db.session.commit()
            post_dict = {}
            post_dict['post_id'] = post.id
            post_dict['post_title'] = post.title
            post_dict['post_content'] = post.content
            post_dict['post_image'] = f'http://127.0.0.1:5000/static/uploads/{post.image}'
            post_dict['post_created_at'] = post.created_at
        else:
            post = Post(title=title,content=content)
            db.session.add(post)
            db.session.commit()
            post_dict = {}
            post_dict['post_id'] = post.id
            post_dict['post_title'] = post.title
            post_dict['post_content'] = post.content
            post_dict['post_image'] = None
            post_dict['post_created_at'] = post.created_at

        return jsonify({
            "status":"success",
            "message":"Post created successfully",
            "data":post_dict
        }),201
    else:
        return jsonify({
            "status":"failure",
            "message":"Request method should be POST",
            "data":{}
        }),400
