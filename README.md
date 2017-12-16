### spark jobs
```
spark-submit --class FollowerRDD p42.jar

```


### bulk import
#### creating index
```
curl -XPUT 'localhost:9200/movies_users?pretty' -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
'



PUT movies
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
```

#### users
```
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/movies_users.json"

```

#### movies
```
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/movies.json"

```

#### enabling aggregations on field
```
PUT movies/_mapping/movie
{
  "properties": {
    "keywords": { 
      "type":     "text",
      "fielddata": true
    }
  }
}
```

## docker

### build
```
sudo docker build es/ --tag=elastic
```
### run
```
sudo sysctl -w vm.max_map_count=262144
sudo docker  run -d -p 9200:9200 -e "ES_JAVA_OPTS=-Xms4g -Xmx4g" elastic
```

### changing es heap size
```

ES_JAVA_OPTS="-Xms4000m -Xmx4000m" ./bin/elasticsearch
```


### for es
```
docker run  -e "ES_JAVA_OPTS=-Xms4000m -Xmx4000m" elastic
```