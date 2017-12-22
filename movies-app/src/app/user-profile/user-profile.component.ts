import { Component, OnInit } from '@angular/core';
import {UserProfileService} from "../user-profile.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(protected us: UserProfileService) { }

  movies$;
  ngOnInit() {
    this.movies$=this.us.fetchUserMovies()

  }




}
