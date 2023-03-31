from flask import session, request, abort
from urllib.parse import urlencode
import spotipy
from spotipy import oauth2
from dotenv import load_dotenv
import os
import statistics

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
    redirect_url = f'http://localhost:3000/home?{query_string}'
    # session['token_info'] = token_info
    # session['access_token'] = token_info['access_token']
    return redirect_url
    
# TODO: properly implement
def clear_session():
    session.pop("token_info", None)

def get_playlists(access_token):
    """
    Gets all the Wrapped Playlists belonging to the user
    
    :param access_token: Spotify access token
    :return: Wrapped Playlists with playlist info, tracks, audio features and duration
    """

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
            playlist_tracks = [item['track'] for item in sp.playlist_tracks(playlist['id'])['items']]
            audio_features = get_audio_features(sp, playlist_tracks)
            total_duration = get_total_duration(playlist_tracks)
            cleaned_up_playlist = create_playlist_dict(playlist, playlist_tracks, audio_features, total_duration)
            wrapped_playlists.append(cleaned_up_playlist)
    # print(wrapped_playlists)
    return wrapped_playlists



def get_audio_features(sp, playlist_tracks):
    """
    Gets audio features of all tracks in the playlist and performs calculations on the numbers.
    
    :param sp: spotipy object.
    :param playlist_tracks: All the tracks of the playlist
    :return: A total summary of the audio features.
    """

    track_ids = [track['id'] for track in playlist_tracks if track is not None]
    audio_features = sp.audio_features(track_ids)
    
    features = {}
    for track in audio_features:
        for feature, value in track.items():
            if not isinstance(value, str):
                if feature not in features:
                    features[feature] = []
                features[feature].append(value)

    summary_of_stats = {}
    for feature, value in features.items():
        summary_of_stats[feature] = {
            'mean' : statistics.mean(value),
            'median': statistics.median(value),
            'min': min(value),
            'max': max(value),
            'std_dev': statistics.stdev(value)
        }

    return summary_of_stats

def get_total_duration(playlist_tracks):
    """
    Gets the total duration of the playlist by summing up the durations of all the tracks.
    
    :param playlist_tracks: All the tracks of the playlist
    :return: Total duration of playlist in hours.
    """

    return sum([track['duration_ms'] for track in playlist_tracks if track is not None])/3600000


def create_playlist_dict(playlist, playlist_tracks, audio_features, total_duration):
    """
    Creates a simplified, cleaner playlist objecct to send back to the client.
    
    :param playlist: The full playlist object returned by Spotift Web API
    :param playlist_tracks: All the tracks of the playlist
    :param audio_features: Total summary of the audio features of the playlist
    :param total_duration: Total duration in hours of the playlist
    :return: Dictionary with playlist info
    """
    
    playlist_dict = {
        'id': playlist['id'],
        'name': playlist['name'],
        'image': playlist['images'][0]['url'],
        'totalDuration': total_duration,
        'year': playlist['name'][-4:],
        'url': playlist['external_urls']['spotify'],
        'tracks': playlist_tracks,
        'audioFeatures': audio_features
    }
    return playlist_dict

def create_spotify_client(access_token):
    """
    Creates Spotify client with spotipy.
    
    :param access_token: Spotify access token
    :return: spotipy client
    """

    if not access_token:
        return None
    sp = spotipy.Spotify(auth=access_token)
    return sp