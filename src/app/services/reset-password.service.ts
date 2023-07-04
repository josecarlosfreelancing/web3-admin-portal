import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {LoaderService} from "./loader.service";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient,
    private loaderService: LoaderService) { }

  sendRequestByEmail(email: string): Promise<any> {
    this.loaderService.showLoader();
    return new Promise<any>((resolve, reject) => {
      this.http.post<any>(environment.apiURL + "/auth/na/resetPasswordByEmail", {email: email}, {withCredentials: false})
        .toPromise()
        .then((response: any) => {
          resolve(response);
        }).catch((error: any) => {
          reject(error);
        }).finally(() => {
        this.loaderService.hideLoader();
      })
    });
  }

  resetPassword(token: string, email: string, password: string): Promise<any> {
    this.loaderService.showLoader();
    return new Promise<any>((resolve, reject) => {
      let params = {token: token, email: email, newPassword: password};
      this.http.post<any>(environment.apiURL + "/auth/na/validateResetPassword", params, {withCredentials: false})
        .toPromise()
        .then((response: any) => {
          resolve(response);
        }).catch((error: any) => {
          reject(error);
        }).finally(() => {
          this.loaderService.hideLoader();
        })
    });
  }
}
