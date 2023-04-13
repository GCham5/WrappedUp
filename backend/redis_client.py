import json
from redis import Redis

redis = Redis(host='redis', port=6379, db=0)


def get_value(hashed_id, key):
    value_json = None
    
    if redis.hexists(hashed_id, key):
        # get value of key
        value = redis.hget(hashed_id, key)
        # check if value is not None
        if value is not None:
            # decode value from bytes to string and parse as JSON
            value_json = json.loads(value.decode('utf-8'))

    return value_json
