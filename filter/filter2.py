import json


schema1={ "index" : { "_index" : "movies_users", "_type" : "post", "_id" : "1" } }
schema2={"index":{"_index":"movies","_type":"movie","_id":1}}


file =open("../output/out","r")
file1 =open("../data/movies_users.json","w")


def write_schema1():
	for line in file:
		x=eval(line.strip())
		id=x[0]

		movies=[{"movie":i[0],"rating":i[1]} for i in x[1:]]
		schema1['index']['_id']=id
		file1.write(json.dumps(schema1)+"\n")
		file1.write(json.dumps({"movies":movies})+"\n")


file2_i = open("../data/movies","r")
file2_o = open("../data/movies.json","w")

write_schema1()