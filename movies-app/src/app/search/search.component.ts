import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {AUTH_CONFIG} from "../config/global-config.variables";
import {SearchEntity} from "./search.entity";
import 'rxjs/add/observable/of';

export class State {
  constructor(public name: string, public population: string, public flag: string) { }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() tags: EventEmitter<SearchEntity> = new EventEmitter<SearchEntity>();l

  ngOnInit() {
  }

  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;

  states: any[] = AUTH_CONFIG.genres;

  options:string[]=AUTH_CONFIG.attributes;
  selected=this.options[0];


  constructor() {
    this.stateCtrl = new FormControl();

    this.filteredStates = this.stateCtrl
      .valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .pipe(
        startWith(''),
        map(state =>  this.filterStates(state))
      );
  }


  filterStates(input: string) {

    var showSuggestion=this.selected==this.options[0];

    if(!input){
      this.tags.emit(new SearchEntity(this.selected,[]));
      return this.states;
    }

    let states;
    if(showSuggestion)
      states=this.states.filter(state =>
        state.key.toLowerCase().indexOf(input.toLowerCase()) === 0);
    else
      states=input!=''?[input]:this.states;
    this.tags.emit(new SearchEntity(this.selected,states));

    return showSuggestion?states:[];
  }

}
