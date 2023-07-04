import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pagination } from '../models/pagination.model';
import { LoaderService } from './loader.service';
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private loaderService: LoaderService) { }

  async getUsersList(pagination: Pagination): Promise<Pagination> {
    this.loaderService.showLoader();
    delete pagination.list;
    let parms: any = pagination;
    let params = new HttpParams({fromObject:{...parms}});
    return new Promise((resolve, reject) => {
      this.http.get<Pagination>(environment.apiURL + '/users', { params: params, withCredentials: true})
      .toPromise()
      .then((data: any) => {
        this.loaderService.hideLoader();
        resolve(data);
      });
    });
  }

  createUser(user: User): Promise<any> {
    this.loaderService.showLoader();
    return new Promise<any>((resolve, reject) => {
        this.http.post(environment.apiURL+ '/users', user, {withCredentials: true})
          .toPromise()
          .then((data: any) => {
            resolve(data);
          }).catch((error) => {
            reject(error);
          }).finally(() => {
            this.loaderService.hideLoader();
          });
    });
  }

  updateUser(user: User): Promise<any> {
    this.loaderService.showLoader();
    return new Promise<any>((resolve, reject) => {
      this.http.put(environment.apiURL+ '/users/'+user._id, user, {withCredentials: true})
        .toPromise()
        .then((data: any) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        }).finally(() => {
          this.loaderService.hideLoader();
        });
    });
  }

  removeUser(id: string): Promise<string> {
    this.loaderService.showLoader();
    return new Promise<any>((resolve, reject) => {
      this.http.delete(environment.apiURL + '/users/'+id,{withCredentials: true})
        .toPromise()
        .then(() => {
          resolve("User has been deleted");
        }).catch(() => {
          reject("Error deleting user");
      }).finally(() => {
        this.loaderService.hideLoader();
      })
    })
  }

  getUser(id: string): Promise<User> {
    this.loaderService.showLoader();
    return new Promise<User>((resolve, reject) => {
      this.http.get(environment.apiURL + '/users/' + id, {withCredentials: true})
        .toPromise()
        .then((user: any) => {
          resolve(user);
        }).catch((error) => {
          reject(error);
        }).finally(() => {
        this.loaderService.hideLoader();
      });
    });
  }
}
