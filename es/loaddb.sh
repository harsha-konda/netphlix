curl -XPUT 'localhost:9200/news?pretty' -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
'

curl -XPUT 'localhost:9200/users?pretty' -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
'



elasticdump \
  --input=http://localhost:9200/news \
  --output=/Users/harsha/Google\ Drive/Semester-3/enterpriseWeb/newApp/es/data/test.json \
  --type=data \
--headers='{"Content-Type": "application/json"}' \
--limit=10000


elasticdump \
  --input=/Users/harsha/Google\ Drive/Semester-3/enterpriseWeb/newApp/es/data/my_index.json \
  --output=http://localhost:9200/news \
  --type=data \
--headers='{"Content-Type": "application/json"}' \
--limit=10000
