from flask import Flask
from routes import routes
from dotenv import load_dotenv
import os

load_dotenv()

os.environ['FLASK_ENV'] = os.getenv("FLASK_ENV")

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

app.register_blueprint(routes)


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)