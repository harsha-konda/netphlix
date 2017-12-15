import { Injectable } from '@angular/core';
import {Http,Response,RequestOptions} from "@angular/http";
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AUTH_CONFIG} from "../config/global-config.variables";
import {movie} from "./movie.entity";
@Injectable()
export class MoviesService {

  constructor(protected http: Http) {}

  getTopMovies(size):Observable<movie[]>{
    const url=`${AUTH_CONFIG.nodeUrl}/es/movies/${size}`;
    return this.http.get(url)
      .map(data=>data.json().hits)
      .catch(this.handleError);
  }

  getMovieByTrait(trait,states):Observable<movie[]>{
    const url=`${AUTH_CONFIG.nodeUrl}/es/movies/${trait}/true`;
    const body={words:states};
    return this.http.post(url,body)
      .map(data=>data.json().hits)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }



}
