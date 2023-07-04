import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResetPasswordService} from "../../services/reset-password.service";

@Component({
  selector: 'app-reset-new-password',
  templateUrl: './reset-new-password.component.html',
  styleUrls: ['./reset-new-password.component.scss']
})
export class ResetNewPasswordComponent implements OnInit {

  public showCode: boolean = false;
  public showEmail: boolean = false;

  private code: string = "";
  private email: string = "";

  public frmReset = new FormGroup({
    password: new FormControl("", [Validators.required]),
    Npassword: new FormControl("", [Validators.required])
  });

  constructor(private activateRouter: ActivatedRoute,
    private resetPasswordService: ResetPasswordService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.activateRouter.queryParams.subscribe((params: any) => {
      if (!params.code) { this.showCode = true; }
      if (!params.email) { this.showEmail = true; }
      if (this.showCode || this.showEmail) {
        this.frmReset.disable();
        return
      }

      this.code = params.code;
      this.email = params.email;
    });
  }

  validatePass(e: any) {
    if (this.frmReset.get('password')?.value != e.target.value) {
      this.frmReset.get('Npassword')?.setErrors({invalid: true});
    }
  }

  resetPassword() {
    if (!(!!this.code) || !(!!this.email)) {
      this.toastr.warning("Data for password reset not identified");
      return;
    }
    if (this.frmReset.get('password')?.value != this.frmReset.get('Npassword')?.value) {
      this.frmReset.get('Npassword')?.setErrors({invalid: true});
      return;
    }
    this.resetPasswordService.resetPassword(this.code, this.email, this.frmReset.get('password')?.value).then(() => {
      this.toastr.success("Password has been successfully updated", "", {
        timeOut: 4000
      });
      this.router.navigateByUrl("/login");
    }).catch(error => {
      this.toastr.error(error.error.message);
    })
  }

}
