import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { RolesComponent } from './components/home/roles/roles.component';
import { UsersComponent } from './components/home/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginActivateGuard } from './login-activate.guard';
import { PathRootGuard } from './path-root.guard';
import {ResetNewPasswordComponent} from "./components/reset-new-password/reset-new-password.component";

const routes: Routes = [
  {
    path: "",
    component: AppComponent,
    pathMatch: "full",
    canActivate: [PathRootGuard]
  },
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full"
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    pathMatch: "full"
  },
  {
    path: "reset-new-password",
    component: ResetNewPasswordComponent,
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [LoginActivateGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'users',
        component: UsersComponent,
        canLoad: []
      },
      {
        path: 'roles',
        component: RolesComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
