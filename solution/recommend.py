from flask import Flask,request
from flask_cors import CORS
import json
import numpy as np
app = Flask(__name__)
import requests
CORS(app)
from similarity import ComputeSimilarity

node_url='http://localhost:3000/es/users/get'
MAX_HITS=10

@app.route("/recommend",methods=['POST'])
def recommend():
    payload=request.get_json(silent=True)
    user=set(payload['movies'])
    r=requests.post(node_url,data=payload)
    hits=ComputeSimilarity(user,r.json(),MAX_HITS).mapped_hits

    movies_map={}
    movie_len=0
    for hit in hits:

        movies_list=hit['movies']
        for cur_mv_map in movies_list:
            movie,rating=cur_mv_map['movie'],cur_mv_map['rating']
            if movie in user:
                continue

            if movie not in movies_map:
                movies_map[movie]={}

            movies_map[movie]['count']=movies_map[movie].get('count',0)+1
            movies_map[movie]['rating']=movies_map[movie].get('rating',0)+rating

    movies=map(lambda (key,value_dict): (key,value_dict['rating']*1.0/value_dict['count']),movies_map.iteritems())
    movies=sorted(movies,key=lambda x:-x[1])
    return json.dumps(zip(*movies)[0][:min(MAX_HITS*5,len(movies))])

if(__name__ == '__main__'):
    app.run(debug=True, host="0.0.0.0", port=5000, threaded=True)
  