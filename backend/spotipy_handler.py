from flask import session, request, abort
import spotipy
from spotipy import oauth2
from dotenv import load_dotenv
import os

load_dotenv()

client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
redirect_uri = os.getenv("SPOTIPY_REDIRECT_URI")
scope = "user-library-read playlist-read-private"

auth_manager = oauth2.SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope,show_dialog=True)

def authorize():
    auth_url = auth_manager.get_authorize_url()
    return auth_url

def handle_callback():
    code = request.args.get('code')
    token_info = auth_manager.get_access_token(code)
    session['token_info'] = token_info
    session['access_token'] = token_info['access_token']

def clear_session():
    session.pop("token_info", None)

def get_playlists():
    sp = create_spotify_client()
    if not sp:
        abort(401, "Unauthorized")

    all_playlists = []
    offset = 0
    while True:
        playlists = sp.current_user_playlists(limit=50, offset=offset)
        all_playlists.extend(playlists['items'])
        if playlists['next']:
            offset += 50
        else:
            break

    wrapped_playlists = []
    for playlist in all_playlists:
        if playlist['name'].startswith('Your Top Songs'):
            wrapped_playlists.append(playlist)
    print(wrapped_playlists)
    return wrapped_playlists


def create_spotify_client():
    if 'access_token' not in session:
        return None

    token = session['access_token']
    sp = spotipy.Spotify(auth=token)
    return sp
