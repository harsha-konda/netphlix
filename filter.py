import pandas as pd
import numpy as np
import json
import sys

#issues: belongs_to_collection,release_date
def parse_movies():
    movie_url='https://image.tmdb.org/t/p/original'
    movies=pd.read_csv('data/movies_metadata.csv',
                       usecols=['adult','genres','budget','id','title','overview','tagline','vote_average','vote_count','belongs_to_collection','release_date'])
    keywords=pd.read_csv('data/keywords.csv')

    def cast_to_int(x):
        try:
            a=int(x)
        except:
            return 0
        return a

    def map_genres(genres):
        output=None
        try:
            output=json.dumps(map(lambda x: x['name'],eval(genres)))        
        except Exception as e:
            output=[]
        finally:
            return output

    def cast(key,value):
        try:
            if(key=='belongs_to_collection'):
                return ({} if pd.isnull(value) else eval(value))

            if(key=='release_date'):
                return ("0000-01-01" if pd.isnull(value) else value)

            return (eval(value))

        except Exception as ex:
            if(pd.isnull(value)):
                return "null"

            return value


    keywords['id']=keywords['id'].apply(cast_to_int)
    movies['id']=movies['id'].apply(cast_to_int)
    df=pd.merge(movies,keywords,on='id',how='inner')
 
    df['genres']=df['genres'].apply(map_genres)
    df['keywords']=df['keywords'].apply(map_genres)
    schema={"index":{"_index":"movies","_type":"movie","_id":1}}
    f=open('data/movies.json', 'w')
    columns=df.columns.values

    count =set()
    for index, row in df.iterrows():
        out={}
        id=None
        for key,value in  zip(columns,row):
            out[key]=cast(key,value)
            if(key=="id"):
                id=value

        count.add(id)    
        schema["index"]["_id"]=id
        f.write(json.dumps(schema,ensure_ascii=True)+"\n")
        f.write(unicode(json.dumps(out))+"\n")
    print len(count)

parse_movies()
