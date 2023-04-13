from flask import Blueprint, jsonify, redirect, request,  make_response
from flask_cors import CORS
from spotipy_handler import handle_callback, clear_session, get_playlists, get_user, authAndCallback, get_auth_url, set_session
from dotenv import load_dotenv
import os

load_dotenv()

routes = Blueprint('routes', __name__)

CORS(routes,resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@routes.route('/test')
def test():
    print('test')
    return 'sup'

@routes.route("/")
def login():
    auth_url = get_auth_url()
    return jsonify(auth_url)

@routes.route("/callback")
def callback():
    redirect_url = handle_callback()
    return redirect(redirect_url)

@routes.route("/authorize")
def authorize():
    return jsonify(set_session(request.code))

@routes.route('/sign_out')
def sign_out():
    clear_session()
    return redirect('http://localhost:3000/')

@routes.route('/user')
def user():
    try:
        user = get_user('blah')
    except Exception as e:
        print(e)
    return user


# @routes.route('/refresh')
# def refresh():
#     try:
#         token = refresh_token(request.refresh_token)
#     except Exception as e:
#         print(e)
#     return token
    
@routes.route('/wrapped_playlists', methods=['GET'])
def get_wrapped_playlists():
    try:
        wrapped_playlists = get_playlists('blah')
    except Exception as e:
        print(e)
        return redirect('/')
    return jsonify(wrapped_playlists)


# extract access token from header at each request
def extract_access_token():
    header_value = request.headers.get('Authorization')
    if header_value is not None and header_value.startswith('Bearer '):
        code = header_value.split(' ')[1]
        request.code = code