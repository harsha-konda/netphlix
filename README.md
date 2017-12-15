### spark jobs
```
spark-submit --class FollowerRDD p42.jar

```


### bulk import
#### creating index
```
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
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/movies_users.json"; echo

```

#### movies
```
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/movies.json"; echo

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

### changing es heap size
```
ES_JAVA_OPTS="-Xms4000m -Xmx4000m" ./bin/elasticsearch
```

### for es
```
docker run  -e "ES_JAVA_OPTS=-Xms4000m -Xmx4000m" elastic
```