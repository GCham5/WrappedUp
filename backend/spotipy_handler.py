from flask import session, request, abort
from urllib.parse import urlencode
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
    access_token = token_info['access_token']
    refresh_token = token_info['refresh_token']
    query_params = {
        'access_token': access_token,
        'refresh_token': refresh_token
    }
    query_string = urlencode(query_params)
    redirect_url = f'http://localhost:3000/trends?{query_string}'
    # session['token_info'] = token_info
    # session['access_token'] = token_info['access_token']
    return redirect_url
    

def clear_session():
    session.pop("token_info", None)

def get_playlists(access_token):

    sp = create_spotify_client(access_token)
    if not sp:
        abort(401, "No token")

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
    return wrapped_playlists


def create_spotify_client(access_token):
    if not access_token:
        return None
    sp = spotipy.Spotify(auth=access_token)
    return sp
