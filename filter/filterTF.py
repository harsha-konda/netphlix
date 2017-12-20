import json


class MoviesTF:
    def __init__(self):
        self.schema={ "index" : { "_index" : "movies_tf", "_type" : "movie", "_id" : "1" } }
        self.file=open("../output/movieTF/part-00000","r")
        self.inv_count=1.0/float(open("../output/movieCount/part-00000").readline())
        self.file_w=open("../data/movies_tf.json","w")

        self.write_schema()

    def write_schema(self):

        for line in self.file:
            (movie_id,count)=eval(line.strip())

            self.schema['index']['_id']=movie_id

            self.file_w.write(json.dumps(self.schema)+"\n")
            self.file_w.write(json.dumps({"count":count*self.inv_count*100})+"\n")

if __name__ == '__main__':
    MoviesTF()
