import {AfterContentInit, Component, OnInit} from '@angular/core';
import {MoviesService} from "../movie/movies.service";
import {movie} from "../movie/movie.entity";
import { NgModel } from '@angular/forms';
import {Observable} from "rxjs/Observable";
import {SearchEntity} from "../search/search.entity";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private mvservice:MoviesService){}
  movies$: Observable<movie[]>;
  initMovies$:Observable<movie[]>;
  counter=0;
  ngOnInit() {
    this.getMovies();
  }

  getMovies(){
    this.movies$= this.mvservice.getTopMovies(100);
  }

  getMovieOnTags(input :SearchEntity){
    const {trait,states}=input;
    this.movies$=this.mvservice.getMovieByTrait(trait,states.map((obj)=>obj['key']?obj['key']:obj));
  }

}
