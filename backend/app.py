from flask import Flask
from flask_cors import CORS
from routes import routes, extract_access_token
from dotenv import load_dotenv
from flask_session import Session
import os

load_dotenv()

os.environ['FLASK_ENV'] = os.getenv("FLASK_ENV")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.secret_key = os.getenv("SECRET_KEY")
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
app.before_request(extract_access_token)


app.register_blueprint(routes)


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)