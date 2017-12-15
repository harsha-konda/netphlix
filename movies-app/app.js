const express = require('express');
var path = require('path');
const app = express();
const es=require('elasticsearch');
const cors = require('cors');
var bodyParser = require('body-parser');

/**
 * index
 * */
const i_m="movies";
const t_m="movie";
const i_u="movies_users";
const type="post";
const g_size=100;

/**
 * Configure
 * */
const client = new es.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', express.static('dist'));


/**
 * Get some top movies
 * */
app.get('/es/movies/:size',function(req,res){
  const {size} =req.params;
  client.search({
    index:i_m,
    type:t_m,
    body:{
      query:{
        range:{vote_count:{gte:5000}},
      },
      sort:[{vote_average:{order:"desc"}}]
    },
    size:size?size:g_size
  }).then(function (body) {
    res.json(body.hits);
  },function(err){
    console.log(err);
  });
});

/**
 * recommend by users like movies
 * @param movies:[movieid]
 * */
app.post('/es/users/recommend',function(req,res){

  const{movies,size} =req.body;
  let query=[];

  movies.forEach(function(movie){
    const mini_q={
      match:{
        movies:movie
      }
    };
    query.push(mini_q);
  });

  client.search({
    index:i_u,
    type:type,
    body:{
      "query":{
        "bool":{
          "should": query
        }
      },
      size:size?size:g_size
    }
  }).then(function(body){
    res.json(body.hits);
  },function (err){
    console.log("whoops error");
  });
});

/**
 * search by keyWords,genres (array type objects)
 * @param keyWords:[word]
 * */
app.post('/es/movies/:attribute/:sort',function(req,res){
  const {attribute,sort}=req.params;
  const {words}=req.body;
  const size=req.body.size?req.body.size:50;
  let query=[{range:{vote_count:{gte:1000}}}];

  words.forEach(function(word){
    console.log(word);
    const mini_q={match:{[attribute]:word}};
    query.push(mini_q);
  });

  query={
    index:i_m,
    type:t_m,
    body:{
      query:{
        bool:{
          must:query
        }
      },
      size:size
    }
  };
  if(sort)
    query['body']['sort']=[{vote_average:{order:"desc"}}];

  client.search(query).then(function(body){
    res.json(body.hits);
  },function(err){
    console.log(err);
  });
});

app.listen(3000, function () {
  console.log('Movies app listening on port 3000!')
});

