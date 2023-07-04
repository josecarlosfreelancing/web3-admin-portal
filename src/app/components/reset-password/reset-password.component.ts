import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ResetPasswordService} from "../../services/reset-password.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public email: string = "";
  public frmEmail = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email])
  });
  public disBtn: boolean = false;

  constructor(private resetPasswordService: ResetPasswordService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }

  async resetPass() {
    this.disBtn = true;
    this.resetPasswordService.sendRequestByEmail(this.email).then(() => {
      this.toastr.success("A link to reset your password has been sent to your e-mail address.", "", {
        timeOut: 10000
      });
      setTimeout(() => {
        this.toastr.info("If you can't see the email, check your spam folder.", "", {
          timeOut: 10000
        });
      }, 500);
      this.frmEmail.reset();
      this.disBtn = false;
      setTimeout(() => {
        this.toastr.info("You will be redirected to login");
      }, 600);
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 10000);
    }).catch((error) => {
      console.log(error);
      this.toastr.error("Error requesting password reset");
    });
  }
}
