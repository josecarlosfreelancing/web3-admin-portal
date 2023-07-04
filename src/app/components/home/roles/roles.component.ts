import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user.model";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {RolesService} from "../../../services/roles.service";
import {Rol} from "../../../models/rol.model";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  public rolesList: Rol[] = [];

  constructor(private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private rolesService: RolesService) { }

  ngOnInit(): void {
    const user: User = this.authService.userData;
    if (user.roles?.filter(per => (per === 'admin-roles' || per === 'admin')).length === 0) {
      this.toastr.warning("Unauthorized");
      this.router.navigateByUrl('/home');
    } else {
      this.getRoles();
    }
  }

  getRoles() {
    this.rolesService.getRoles().then(roles => {
      this.rolesList = roles;
    }).catch(() => {
      this.toastr.error("Error getting list of roles");
    });
  }

}
