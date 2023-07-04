import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoaderService} from "./loader.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient,
    private loaderService: LoaderService) { }

  async getTotalUsers(): Promise<any> {
    this.loaderService.showLoader();
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiURL + '/dashboard/totalUsers', {withCredentials: true})
        .toPromise()
        .then((data: any) => {
          resolve(data);
        }).catch(error => {
          reject(error);
        }).finally(() => {
          this.loaderService.hideLoader();
      })
    });
  }

  async getTotalUsersEnabled(): Promise<any> {
    this.loaderService.showLoader();
    return new Promise((resolve, reject) => {
        this.http.get(environment.apiURL + '/dashboard/totalUsersEnabled', {withCredentials: true})
          .toPromise()
          .then((data: any) => {
            resolve(data);
          }).catch(error => {
            reject(error);
          }).finally(() => {
            this.loaderService.hideLoader();
        })
    });
  }

  async getTotalUsersDisabled(): Promise<any> {
    this.loaderService.showLoader();
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiURL + '/dashboard/totalUsersDisabled', {withCredentials: true})
        .toPromise()
        .then((data: any) => {
          resolve(data);
        }).catch(error => {
        reject(error);
      }).finally(() => {
        this.loaderService.hideLoader();
      })
    });
  }
}
