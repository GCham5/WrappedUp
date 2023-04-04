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
scope = "user-library-read playlist-read-private user-top-read"

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

def get_user(access_token):
    """
    Gets the logged in Spotify user
    
    :param access_token: Spotify access token
    :return: Logged in Spotify uesr
    """
    sp = create_spotify_client(access_token)
    if not sp:
        abort(401, "No token")

    user = sp.current_user()
    top_artists = sp.current_user_top_artists(limit=20, offset=0, time_range='long_term')
    user['topArtists'] = top_artists['items']
    return user

def get_playlists(access_token):
    """
    Gets all the Wrapped Playlists belonging to the user, alongside revelant data
    
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
            artists = get_artists_data(playlist_tracks)
            # genres = get_genres(sp, artists)
            audio_features = get_audio_features(sp, playlist_tracks)
            mood = get_mood(audio_features)
            print(mood)
            total_duration = get_total_duration(playlist_tracks)
            cleaned_up_playlist = create_playlist_dict(playlist, playlist_tracks, artists, audio_features, mood, total_duration)
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

def get_mood(audio_features):
    """
    Determines if the playlist is overall happy or sad
    
    :param audio_features: The calculated audio_features of the playlist
    :return: Mood value ranging from 0-1, with 0 being the saddest and 1 being the happiest
    """
    energy = audio_features['energy']['mean']
    valence = audio_features['valence']['mean']
    tempo = audio_features['tempo']['mean']

    # Normalize the values to be between 0 and 1
    energy_norm = (energy - 0.0) / (1.0 - 0.0)
    valence_norm = (valence - 0.0) / (1.0 - 0.0)
    tempo_norm = (tempo - 0.0) / (250.0 - 0.0)

    mood = (valence_norm * 1.5 + energy_norm * 1.0 + tempo_norm * 0.5) / 3.0

    return mood


def get_total_duration(playlist_tracks):
    """
    Gets the total duration of the playlist by summing up the durations of all the tracks.
    
    :param playlist_tracks: All the tracks of the playlist
    :return: Total duration of playlist in hours.
    """

    return sum([track['duration_ms'] for track in playlist_tracks if track is not None])/3600000

def get_artists_data(playlist_tracks):
    """
    Gets all the artists for the playlist.
    
    :param playlist_tracks: All the tracks of the playlist
    :return: The artists found in the playlist.
    """

    all_artists = [track['artists'] for track in playlist_tracks]
    artist_data = {}
    for artists_in_track in all_artists:
        for artist in artists_in_track: # some songs can have mutliple artists
            if artist['id'] not in artist_data:
                artist_data[artist['id']] = {
                    'name': artist['name'],
                    'count': 0
                }
            artist_data[artist['id']]['count'] += 1

    sorted_data = dict(sorted(artist_data.items(), key=lambda x: x[1]['count'], reverse=True))

    return sorted_data

def get_genres(sp, artists):
    """
    Gets the genres associated with playlist.
    
    :param artists: All artists in playlist, alongside their count
    :return: The genres found in the playlist.
    """

    ids = list(artists.keys())
    # print(ids)
    for id in ids:
        genres_of_artist = sp.artist(id)['genres']
    print(genres_of_artist)




def create_playlist_dict(playlist, playlist_tracks, artists, audio_features, mood, total_duration):
    """
    Creates a simplified, cleaner playlist objecct to send back to the client.
    
    :param playlist: The full playlist object returned by Spotift Web API
    :param playlist_tracks: All the tracks of the playlist
    :param artists: All the artists found in the playlist
    :param audio_features: Total summary of the audio features of the playlist
    :param mood: A value between 0-1 that indicates how happy or sad the year was
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
        'artists': artists,
        'audioFeatures': audio_features,
        'mood': mood
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
