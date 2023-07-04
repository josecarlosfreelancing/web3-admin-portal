import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { ToastrService } from 'ngx-toastr';
import { Rol } from '../models/rol.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Subject, take } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Objeto con los datos del usuario
  userData: User = {} as User;
  userChange: Subject<User> = new Subject<User>();

  constructor(private afauth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private loaderService: LoaderService) {
      this.userChange.subscribe((value) => {
        this.userData = value;
      });
  }

  async register (email: string, contrasenia: string) {
    try {
      return await this.afauth.createUserWithEmailAndPassword(email, contrasenia);
    } catch (error) {
      return null;
    }
  }

  async login (email: string, contrasenia: string) {
    try {
      this.loaderService.showLoader();
      await this.afauth.signInWithEmailAndPassword(email, contrasenia).then((result) => {
        this.validateLoginAndGetDataUser(email, contrasenia);
      });
      return;
    } catch (error: any) {
      switch(error.code){
        case "auth/user-not-found":
          this.toastr.warning("Non-registered user");
          break;
        case "auth/missing-email":
        case "auth/invalid-email":
        case "auth/wrong-password":
          this.toastr.warning("Incorrect login data");
          break;
        case "auth/user-disabled":
          this.toastr.warning("User disabled");
          break;
        default:
          this.toastr.error("Unexpected error, contact administrator");
          break;
      }
      this.loaderService.hideLoader();
      return null;
    }
  }

  validateLoginAndGetDataUser(email: string, contrasenia: string) {
    this.http.post(environment.apiURL+"/app/auth/login", {emailOrPhone: email, password: contrasenia}, {withCredentials: true}).subscribe((data: any) => {
      this.getUserDataPromise().then(() => {
        //console.log("datos del usuario", this.userData);
        this.router.navigate(['home']);
        this.loaderService.hideLoader();
      }).finally(() => {
        this.loaderService.hideLoader();
      });
    }, err => {
      this.toastr.error(err.error.message);
      this.afauth.signOut();
    })
  }

  async loginWithGoogle (email: string, contrasenia: string) {
    try {
      return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
        this.router.navigate(['home']);
      });
    } catch (error) {
      this.toastr.error("Hubo un error al acceder con la cuenta de google");
      return null;
    }
  }

  getUserSession(): Promise<User> {
    this.loaderService.showLoader();
    return new Promise((resolve, reject) => {
      this.http.get<User>(environment.apiURL + '/auth/getUserAuth', {withCredentials: true})
        .toPromise()
        .then((data: any) => {
          this.loaderService.hideLoader();
          resolve(data);
        }).catch((error) => {
          this.loaderService.hideLoader();
          if (error.error.message != "El token ha sido revocado") {
            this.toastr.error("Error al obtener datos del usuario en sesión");
          }
          reject(error);
      });
    });
  }

  getUserLogged() {
    return this.afauth.authState;
  }

  async logout() {
    try{
      this.loaderService.showLoader();
      return await this.afauth.signOut().then(() => {
        this.router.navigate(['login']);
        this.loaderService.hideLoader();
      });
    } catch(error) {
      //console.log(error);
      return null;
    }
  }

  getJWTAuth(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.afauth.onAuthStateChanged( user => {
        if (user) {
          user.getIdToken().then(idToken => {
            resolve(idToken);
          });
        }
      });
    })
  }

  getUserDataPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afauth.authState.subscribe((user: any) => {
        if (user) {
          this.getUserSession().then(userRes => {
            let userData = userRes;
            userData.accessToken = user._delegate.accessToken;
            this.userData = userData;
            this.userChange.next(userData);
            //console.log("userData desde el service", userData);
            resolve(userData);
          });
        }
        resolve("");
      })
    });
  }

}
