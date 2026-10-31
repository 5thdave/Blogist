from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    title = db.Column(db.String(100),nullable=False)
    content = db.Column(db.Text)
    image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime,default=datetime.utcnow)
    
    
    def __repr__(self):
        return f'{self.title}'
    
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    username = db.Column(db.String(200),nullable=False,unique=True)
    email = db.Column(db.String(200),nullable=False,unique=True)
    password_hash = db.Column(db.String(255),nullable=False)
    payments = db.relationship('Payment',backref='user')
    
    def __repr__(self):
        return f'{self.name}'
    
class Item(db.Model):
    __tablename__ = "items"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    name = db.Column(db.String(200),nullable=False)
    description = db.Column(db.Text,nullable=True)
    amount = db.Column(db.Integer,nullable=False)
    created_at = db.Column(db.DateTime , default = datetime.utcnow)
    payments = db.relationship('Payment',backref='item')
    
    
class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    amount = db.Column(db.String(200),nullable=False)
    paid_at = db.Column(db.DateTime , default = datetime.utcnow)
    reference = db.Column(db.String(200),nullable=False,unique=True)
    status = db.Column(db.Enum("pending","failed","success"),default="pending")
    item_id = db.Column(db.Integer,db.ForeignKey('items.id'))
    users_id = db.Column(db.Integer,db.ForeignKey('users.id'))