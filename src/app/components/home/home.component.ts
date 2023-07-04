import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public user: User = {} as User;

  public show: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (!this.user._id) {
      this.authService.getUserDataPromise();
    }
    this.authService.userChange.subscribe(data => {
      this.user = data;
      this.applyShows();
    })
  }

  applyShows() {
    this.show = true;
  }

}
