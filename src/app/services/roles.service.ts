import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoaderService} from "./loader.service";
import {Rol} from "../models/rol.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient,
    private loaderService: LoaderService) { }

  getRoles(): Promise<Rol[]> {
    this.loaderService.showLoader();
    return new Promise<Rol[]>((resolve, reject)  => {
      this.http.get<Rol[]>(environment.apiURL + '/roles', {withCredentials: true})
        .toPromise()
        .then((data : any) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        }).finally(() => {
          this.loaderService.hideLoader();
        });
    });
  }
}
