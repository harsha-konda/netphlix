[![Build Status](https://travis-ci.com/harsha-konda/netphlix.svg?token=rDtgdJpvq2dsfcM9RHLT&branch=master)](https://travis-ci.com/harsha-konda/netphlix)


![alt text](https://github.com/harsha-konda/netphlix/blob/master/p22.png "architecture")

## issues
1. ~node server integration test~
2. ~breaks without a server on 5000~
3. ~mount volume instead of curl in **es**~
4. add basic k8 commands to k8 primer

## to-do ☹
1. ~Correctness~
2. ~Percentage counts > 100~
3. ~Integrate with frontend~
4. ~Develop test cases~
5. Submitters
6. Graders
7. WriteUp
8. Jenkins Pipeline
9. Primer
10. java solution

## repo
- https://s3.amazonaws.com/hkonda-code/netflix.tar

## Docs

### run
```
./app.sh -b -a 
./app.sh -
```

### spark jobs
```
cd filter-links/
```
```
spark-submit --class FilterUsers  target/scala-2.11/comcast-assembly-1.0.jar
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
### prune
```
docker system prune -a
```

### build
```
sudo docker build es/ --tag=elastic
```
### run
```
sudo sysctl -w vm.max_map_count=262144
sudo docker  run -d -p 9200:9200 -e "ES_JAVA_OPTS=-Xms4g -Xmx4g" elastic
```

## git
```
git config credential.helper store
```
