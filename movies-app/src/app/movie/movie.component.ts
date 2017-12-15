import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {movie} from "./movie.entity";
import {AUTH_CONFIG} from "../config/global-config.variables";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  @Input() movie:movie;
  selected: boolean=false;

  @Output() output: EventEmitter<boolean>=new EventEmitter<boolean>();

  counter=0;
  movieUrl=AUTH_CONFIG.image_path;

  constructor(){}

  colors=['primary','accent','warn','']

  ngOnInit() {
  }

  handleLike(){
    this.selected=!this.selected;
    this.output.emit(this.selected);
  }
}
