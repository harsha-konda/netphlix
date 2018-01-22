const express = require('express');
const path = require('path');
const app = express();
const es=require('elasticsearch');
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');

/**
 * index
 * */
const i_m="movies";
const t_m="movie";
const i_u="movies_users";
const type="post";
const g_size=100;
const i_tf="movies_tf";
const numUserReco=100;
// const flaskUrl='http://solution-service/recommend';
// const esUrl='http://es-service';
const flaskUrl='http://localhost:5000/recommend'
const esUrl='http://localhost:9200'   //TODO: pass these as env variables -> npm run dev

/**
 * Configure
 * */
const client = new es.Client({
  host: esUrl,
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
 * get movies data for an array of movies
 * @param movies:[movieid}
 * */
app.post('/es/movies/get',function (req,res) {
  const {movies}=req.body;
  const output=getMovies(movies);
  Promise
    .resolve(output)
    .then((result)=>res.json(result))
    .catch((error)=>console.log(error));
});


/**
 * get by users for a given set of movies
 * @param movies:[movieid]
 * */
app.post('/es/users/get',function(req,res){
  const{movies,size} =req.body;
  const query=buildMatchQuery(movies);
  const users=queryForUsers(query,size);
  Promise.resolve(users)
    .then((result)=>res.json(result))
    .catch((error)=>console.log(movies));
});

/**
 * recommend users by requsting python backend
 * */
app.post('/es/users/recommend',function(req,res){
  const {movies}=req.body;

  request
    .post(flaskUrl,{json:{movies:movies}})
    .on('response',(response)=>response.on('data',(data)=>returnMovies(res,data)))
    .on('error',(error)=>{console.log(error);console.log("make sure your started the flask server")});
});

function returnMovies(res,movies){
  Promise
    .resolve(getMovies(movies))
    .then((data)=>res.json(data))
    .catch((err)=>console.log(err));
}

/**
 * A recommendation built judging by the relative frequency of a term
 **/
app.post('/es/movies/tf',function (req,res) {
  const {ids}=req.body;
  const query=queryForMoviesTf(ids,g_size);
  Promise
    .resolve(query)
    .then((result)=>res.json(result))
    .catch((error)=>console.log(error));
});

/**
 * search by keyWords,genres (array type objects)
 * @param keyWords:[word]
 * */
app.post('/es/movies/:attribute/:sort',function(req,res){
  const {attribute,sort}=req.params;
  const {words}=req.body;
  const size=req.body.size?req.body.size:g_size;
  let query=[{range:{vote_count:{gte:5000}}}];

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
  console.log('Movies-app listening on port 3000!')
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,'dist/index.html'))
});

/**
 * helper functions
 * */

function buildMatchQuery(movies){
  let query=[];

  if(!movies)
    return query;

  movies.forEach(function(movie){
    const mini_q={
      match:{
        'movies.movie':movie
      }
    };
    query.push(mini_q);
  });
  return query;
}

function queryForUsers(query,size){
  return new Promise( (resolve,reject) => {
    client.search({
      index:i_u,
      type:type,
      body:{
        query:{
          bool:{
            should: query
          }
        },
        size:numUserReco
      }
    }).then(function(body){
      let result=[];
      body.hits.hits.forEach((hit)=>result.push(hit['_source']));
      resolve(result);
    },function (err){
      reject(err);
    });
  })
}

function getMovies(movies) {
  return new Promise((resolve,reject)=>{
  client.search({
      index: i_m,
      type: t_m,
      body: {
        query: {
          ids: {
            type: t_m,
            values:  movies instanceof Buffer ? JSON.parse(movies):movies 
          }
        },
        size: movies.length
      }
    }).then(
      (result)=>{
        const hits=(result.hits.hits);
        let output=[];
        hits.forEach((hit)=>{
          let tempOutput=hit['_source'];
          tempOutput['_id']=hit['_id'];
          output.push(tempOutput);
        });
        resolve(output);
      },
      (err)=>reject(err)
    );
  });
}


function queryForMoviesTf(ids){
  return new Promise((resolve,reject)=> {
    client.search({
      index: i_tf,
      type: t_m,
      body: {
        query: {
          ids: {
            type: t_m,
            values: ids
          }
        },
        size:ids.length
      }
    }).then(function (body) {
        let result={};
        body.hits.hits.forEach(
          (hit)=>result[hit['_id']]=hit['_source']['count']
        );
        resolve(result);
    }, function (err) {
      reject(err);
    })
  });
}

