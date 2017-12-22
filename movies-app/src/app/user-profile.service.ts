import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {AUTH_CONFIG} from "./config/global-config.variables";
import {Http,Response,RequestOptions} from "@angular/http";

@Injectable()
export class UserProfileService {

  constructor(protected http: Http) {}


  movies:any[]=[];
  fetchUserMovies() : Observable<any[]> {
    const url=`${AUTH_CONFIG.nodeUrl}/es/movies/get`;
    return this.http
      .post(url,{movies:this.movies})
      .map((res)=>res.json())
      .catch(this.handleError);
  }

  updateUserMovies(selected:boolean,id:any){
    if(!selected)
      this.movies=this.movies.filter((data)=> data!=id);
    else
      this.movies.push(id);
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
