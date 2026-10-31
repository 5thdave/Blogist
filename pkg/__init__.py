from flask import Flask
from pkg.config import DevelopmentConfig
from flask_migrate import Migrate
from pkg.api.routes import api
from flask_cors import CORS



def create_app():   
    from pkg.models import db
    app = Flask(__name__)
    CORS(app, resources={
        r"/api/v1/.*": {
            "origins": ["*"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    app.config.from_object(DevelopmentConfig)
    
    
    app.register_blueprint(api,url_prefix='/api/v1')
    
    db.init_app(app)
    migrate = Migrate(app,db)
    return app

app = create_app()

