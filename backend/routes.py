from flask import Blueprint, jsonify, redirect
from spotipy_handler import authorize, handle_callback, clear_session, get_playlists
from dotenv import load_dotenv
import os

load_dotenv()

routes = Blueprint('routes', __name__)


@routes.route("/")
def login():
    auth_url = authorize()
    return redirect(auth_url)

@routes.route("/callback")
def callback():
    handle_callback()
    return redirect('wrapped_playlists')

@routes.route('/sign_out')
def sign_out():
    clear_session()
    return redirect('http://localhost:3000/')

@routes.route('/wrapped_playlists', methods=['GET'])
def get_wrapped_playlists():
    try:
        wrapped_playlists = get_playlists()
    except Exception as e:
        print(e)
        return redirect('/')

    return jsonify(wrapped_playlists)

@routes.route('/get_wrapped_playlists', methods=['GET'])
def wrapped():
    print('all wrapped')
