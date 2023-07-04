import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/models/login.model';
import { AuthService } from 'src/app/services/auth.service';
import {UserService} from "../../services/user.service";
import {take} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginModel: Login = {
    correo: '',
    contrasenia: ''
  }

  public frmLogin: FormGroup = {} as FormGroup;

  constructor(private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService) {}

  ngOnInit(): void {
    this.frmLogin = new FormGroup({
      correo: new FormControl("", [Validators.required, Validators.email]),
      contrasenia: new FormControl("", Validators.required)
    });
  }

  ingresar() {
    const {correo, contrasenia} = this.loginModel;
    this.authService.login(correo, contrasenia);
  }
}
