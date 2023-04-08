from collections import Counter
from flask import session, request, abort
from urllib.parse import urlencode
import spotipy
from spotipy import oauth2
from dotenv import load_dotenv
import os
import statistics
import uuid


load_dotenv()

client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
redirect_uri = os.getenv("SPOTIPY_REDIRECT_URI")
scope = "user-library-read playlist-read-private user-top-read"

def session_cache_path():
    """Get the path to the session cache folder."""
    caches_folder = "./.spotify_caches/"
    if not os.path.exists(caches_folder):
        os.makedirs(caches_folder)
    return caches_folder + session.get('uuid')

def authorize():
    # if not session.get('uuid'):
        # Step 1. Visitor is unknown, give random ID
    session['uuid'] = str(uuid.uuid4())
 
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = oauth2.SpotifyOAuth(cache_handler=cache_handler,client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope,show_dialog=True)

    auth_url = auth_manager.get_authorize_url()
    return auth_url

def handle_callback():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = oauth2.SpotifyOAuth(cache_handler=cache_handler,client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope,show_dialog=True)

    code = request.args.get('code')
    auth_manager.get_access_token(code)
    token_info = auth_manager.get_access_token(code)
    access_token = token_info['access_token']
    refresh_token = token_info['refresh_token']
    uuid = session['uuid']
    # query_params = {
    #     'access_token': access_token,
    #     'refresh_token': refresh_token
    # }
    query_params = {
        'uuid': uuid
    }
    query_string = urlencode(query_params)
    redirect_url = f'http://localhost:3000/home?{query_string}'
    # session['token_info'] = token_info
    # session['access_token'] = token_info['access_token']
    # spotify = spotipy.Spotify(auth_manager=auth_manager)
    # print(spotify.me())
    return redirect_url
    
# TODO: properly implement
def clear_session():
    session.pop("token_info", None)

def get_user(uid):
    """
    Gets the logged in Spotify user
    
    :param access_token: Spotify access token
    :return: Logged in Spotify uesr
    """
    sp = create_spotify_client(uid)
    if not sp:
        abort(401, "No token")

    user = sp.current_user()
    top_artists = sp.current_user_top_artists(limit=20, offset=0, time_range='long_term')
    user['topArtists'] = top_artists['items']
    return user

def get_playlists(uid):
    """
    Gets all the Wrapped Playlists belonging to the user, alongside revelant data
    
    :param access_token: Spotify access token
    :return: Wrapped Playlists with playlist info, tracks, audio features and duration
    """

    sp = create_spotify_client(uid)
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
            artists = get_artists(sp, playlist_tracks)
            artists_data = get_artists_data(artists)
            genres_data = get_genres(artists)
            albums = get_albums_data(playlist_tracks)
            audio_features = get_audio_features(sp, playlist_tracks)
            mood = get_mood(audio_features)
            dance = get_dance(audio_features)
            popularity = get_popularity(playlist_tracks)
            total_duration = get_total_duration(playlist_tracks)
            cleaned_up_playlist = create_playlist_dict(playlist, playlist_tracks, artists_data, genres_data, albums, audio_features, mood, dance, popularity, total_duration)
            wrapped_playlists.append(cleaned_up_playlist)
    # if a user unliked then liked their Wrapped, it would appear first
    # this ensures the playlists appear in correct order 
    sorted_playlists = sorted(wrapped_playlists, key=lambda x: x['year'], reverse=True)
    return sorted_playlists



def get_audio_features(sp, playlist_tracks):
    """
    Gets audio features of all tracks in the playlist and performs calculations on the numbers.
    
    :param sp: spotipy client
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

def get_dance(audio_features):
    """
    Determines how danceable a playlist is
    
    :param audio_features: The calculated audio_features of the playlist
    :return: Dance value ranging from 0-1, with 0 being the calm and 1 being the very danceable
    """
    energy = audio_features['energy']['mean']
    danceability = audio_features['danceability']['mean']

    # Normalize the values to be between 0 and 1
    energy_norm = (energy - 0.0) / (1.0 - 0.0)
    danceability_norm = (danceability - 0.0) / (1.0 - 0.0)

    danceable = (danceability_norm * 2 + energy_norm * 1) / 3.0

    return danceable

def get_popularity(playlist_tracks):
    """
    Determines the popularity of the playlist by summing the popularity of all tracks and finding the average.
    
    :param playlist_tracks: All the tracks of the playlist
    :return: Average popularity of the playlist.
    """

    # 100 because each Wrapped has 100 songs
    return sum([track['popularity'] for track in playlist_tracks if track is not None])/100



def get_total_duration(playlist_tracks):
    """
    Gets the total duration of the playlist by summing up the durations of all the tracks.
    
    :param playlist_tracks: All the tracks of the playlist
    :return: Total duration of playlist in hours.
    """

    return sum([track['duration_ms'] for track in playlist_tracks if track is not None])/3600000

def get_artists(sp, playlist_tracks):
    """
    Gets all the artists for the playlist
    
    :param sp: spotipy client
    :param playlist_tracks: All the tracks of the playlist
    :return: The artists found in the playlist.
    """

    all_artists = [track['artists'] for track in playlist_tracks]
    full_artist_data = []
    ids = []
    for artists_in_track in all_artists:
        for artist in artists_in_track:
            ids.append(artist['id'])

    # There will for sure be duplicate artists, hence redundant calls; however, since I will be counting how many times
    # an artist appeared in the playlist, I need to keep all occurences
    for i in range(0, len(ids), 50):
        full_artist_data.extend(sp.artists(ids[i:i+50])['artists'])

    return full_artist_data



def get_artists_data(artists):
    """
    Gets the count and images for the artists
    
    :param artists: All the artists in the playlist
    :return: The count and images for each artists.
    """

    artist_data = {}
    for artist in artists:
        if artist['id'] not in artist_data:
            artist_data[artist['id']] = {
                'name': artist['name'],
                'count': 0,
                'images': artist['images']
            }
        artist_data[artist['id']]['count'] += 1

    sorted_data = dict(sorted(artist_data.items(), key=lambda x: x[1]['count'], reverse=True))

    return sorted_data


def get_albums_data(playlist_tracks):
    """
    Gets all the albums for the playlist, alongside how many times they appeared.
    
    :param playlist_tracks: All the tracks of the playlist
    :return: The albums found in the playlist.
    """

    all_albums = [track['album'] for track in playlist_tracks]
    album_data = {}
    for album in all_albums:
        if album['id'] not in album_data:
            album_data[album['id']] = {
                'name': album['name'],
                'count': 0
            }
        album_data[album['id']]['count'] += 1

    sorted_data = dict(sorted(album_data.items(), key=lambda x: x[1]['count'], reverse=True))

    return sorted_data

def get_genres(artists):
    """
    Gets the genres associated with playlist.
    
    :param artists: All artists in playlist
    :return: The genres found in the playlist, with their count.
    """

    all_genres = []
    for artist in artists:
        all_genres.extend(artist['genres'])

    genre_data = {}

    for genre in all_genres:
        if genre not in genre_data:
            genre_data[genre] = {
                'name': genre, # add 'name' to make frontend PieChart reusable
                'count': 0,
            }
        genre_data[genre]['count'] += 1

    # sorted_data = dict(sorted(genre_data.items(), key=lambda x: x[1]['count'], reverse=True))

    return genre_data
    # return sorted_data


def create_playlist_dict(playlist, playlist_tracks, artists_data, genre_data, albums, audio_features, mood, dance, popularity, total_duration):
    """
    Creates a simplified, cleaner playlist objecct to send back to the client.
    
    :param playlist: The full playlist object returned by Spotift Web API
    :param playlist_tracks: All the tracks of the playlist
    :param artists_data: All the artists found in the playlist with their count
    :param genre_data: All the genres found in the playlist with their count
    :param albums: All the albums found in the playlist
    :param audio_features: Total summary of the audio features of the playlist
    :param mood: A value between 0-1 that indicates how happy or sad the year was
    :param dance: A value between 0-1 that indicates how dancable the year was
    :param popularity: Average popularity of the playlist
    :param total_duration: Total duration in hours of the playlist
    :return: Dictionary with playlist info
    """
    
    playlist_dict = {
        'id': playlist['id'],
        'name': playlist['name'],
        'image': playlist['images'][0]['url'],
        'totalDuration': total_duration,
        'year': playlist['name'][-4:],
        'popularity': popularity,
        'url': playlist['external_urls']['spotify'],
        'tracks': playlist_tracks,
        'artists': artists_data,
        'genres': genre_data,
        'albums': albums,
        'audioFeatures': audio_features,
        'mood': mood,
        'dance': dance
    }
    return playlist_dict

def create_spotify_client(uid):
    """
    Creates Spotify client with spotipy.
    
    :param access_token: Spotify access token
    :return: spotipy client
    """
   
    session['uuid'] = uid
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    # cache_handler = spotipy.cache_handler.FlaskSessionCacheHandler(session)
    auth_manager = oauth2.SpotifyOAuth(cache_handler=cache_handler,client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope,show_dialog=True)


    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return None
    sp = spotipy.Spotify(auth_manager=auth_manager)
    return sp