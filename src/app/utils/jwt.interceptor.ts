import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, from, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService,
    private router: Router,
    private toast: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<any> {
    let token: string = "";
    let request = req;
    if (req.withCredentials) {
      await this.authService.getJWTAuth().then(tokenId => {
        token = tokenId;
      });
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });
    }
    request = request.clone({
      withCredentials: false
    });
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          this.toast.warning("Debe iniciar sesión");
          this.router.navigateByUrl('/login');
        }
        return throwError( err );
      }),
    ).toPromise();
  }
}
