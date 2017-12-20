from flask import Flask
from flask_cors import CORS
import json
import numpy as np
app = Flask(__name__)
import requests
CORS(app)
from similarity import ComputeSimilarity

node_url='http://localhost:3000/es/users/recommend'
MAX_HITS=10

@app.route("/recommend",methods=['POST'])
def recommend():
    #payload={"movies":[260,858,318,1196,1221],"size":50}
    payload=request.get_json(silent=True)
    user=set(payload['movies'])
    r=requests.post(node_url,data=payload)
    #{movieid:,rating:}
    print len(r.json())
    hits=ComputeSimilarity(user,r.json(),MAX_HITS).mapped_hits

    movies_map={}
    movie_len=0
    for hit in hits:

        movies_list=hit['movies']
        print len(movies_list)
        for cur_mv_map in movies_list:
            movie,rating=cur_mv_map['movie'],cur_mv_map['rating']
            if movie in user:
                continue

            if movie not in movies_map:
                movies_map[movie]={}

            movies_map[movie]['count']=movies_map[movie].get('count',0)+1
            movies_map[movie]['rating']=movies_map[movie].get('rating',0)+rating

    print "max",movie_len
    movies=map(lambda (key,value_dict): (key,value_dict['rating']*1.0/value_dict['count']),movies_map.iteritems())
    movies=sorted(movies,key=lambda x:-x[1])

    return json.dumps(zip(*movies)[0])

if(__name__ == '__main__'):
    app.run(debug=True, host="0.0.0.0", port=5000, threaded=True)
  