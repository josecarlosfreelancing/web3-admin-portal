import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input()
  user: User = {} as User;

  showUsers = {
    permissions: ['admin-users', 'admin', 'user'],
    show: false
  }

  showRoles = {
    permissions: ['admin-roles', 'admin', 'user'],
    show: false
  }

  constructor() { }

  ngOnInit(): void {

    console.log(this.user)
    this.showUsers.permissions.forEach(per => {
      if (this.user.roles?.includes(per)) {
        this.showUsers.show = true;
        return;
      }
    });
    this.showRoles.permissions.forEach(per => {
      if (this.user.roles?.includes(per)) {
        this.showRoles.show = true;
        return;
      }
    });
  }
}
