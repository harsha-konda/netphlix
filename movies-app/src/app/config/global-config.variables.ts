interface AuthConfig {
  genres:[{
    key:string,
    doc_count:number
  }];
  attributes:string[];
  nodeUrl: string;
  image_path:string;
}

var dns='localhost';
export const AUTH_CONFIG: AuthConfig = {
  attributes:["genres","title","overview","keywords"],
  genres: [{'key':'drama', 'doc_count': 20243}, {'key': 'comedy', 'doc_count': 13176}, {'key': 'thriller', 'doc_count': 7618}, {'key': 'romance', 'doc_count': 6730}, {'key': 'action', 'doc_count': 6590}, {'key': 'horror', 'doc_count': 4670}, {'key': 'crime', 'doc_count': 4304}, {'key': 'documentary', 'doc_count': 3930}, {'key': 'adventure', 'doc_count': 3490}, {'key': 'fiction', 'doc_count': 3042}, {'key': 'science', 'doc_count': 3042}, {'key': 'family', 'doc_count': 2767}, {'key': 'mystery', 'doc_count': 2464}, {'key': 'fantasy', 'doc_count': 2309}, {'key': 'animation', 'doc_count': 1930}, {'key': 'foreign', 'doc_count': 1619}, {'key': 'music', 'doc_count': 1597}, {'key': 'history', 'doc_count': 1398}, {'key': 'war', 'doc_count': 1322}, {'key': 'western', 'doc_count': 1042}, {'key': 'movie', 'doc_count': 765}, {'key': 'tv', 'doc_count': 765}],
  nodeUrl: "",
  image_path:"https://image.tmdb.org/t/p/original"
};
