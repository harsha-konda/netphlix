from flask import Flask,request
from flask_cors import CORS
import json
import numpy as np
app = Flask(__name__)
import requests
CORS(app)
from similarity import ComputeSimilarity

node_url1='http://localhost:3000/es/users/recommend'
node_url2='http://localhost:3000/es/movies/tf'
MAX_HITS=10

@app.route("/recommend",methods=['POST'])
def recommend():
    #payload={"movies":[260,858,318,1196,1221],"size":50}
    payload=request.get_json(silent=True)
    user=set(payload["movies"])
    r=requests.post(node_url1,data=payload)

    hits=ComputeSimilarity(user,r.json(),MAX_HITS).mapped_hits
    movies_map={}
    movies_set=set()
    for hit in hits:
        movies_list=hit['movies']
        for cur_mv_map in movies_list:
            movie,rating=cur_mv_map['movie'],cur_mv_map['rating']
            if movie in user:
                continue
            if movie not in movies_map:
                movies_map[movie]={}
            movies_set.add(movie)
            movies_map[movie]['count']=movies_map[movie].get('count',0)+1
            movies_map[movie]['rating']=movies_map[movie].get('rating',0)+rating

    bg_dict=getMovieTF(movies_set)
    movies=map(lambda (key,value_dict): (key,computeScore(value_dict['count'],bg_dict,key)),movies_map.iteritems())
    movies=sorted(movies,key=lambda x:-x[1])
    return json.dumps(zip(*movies)[0])

def computeScore(count,bg_dict,movie):
    bg=bg_dict[str(movie)]
    fg=count*1.0/MAX_HITS
    return fg/bg*(fg-bg)

def getMovieTF(movies_set):
    r=requests.post(node_url2,data={"ids":list(movies_set)})
    return r.json()

if (__name__ == '__main__'):
    app.run(debug=True, host="0.0.0.0", port=5000, threaded=True)
