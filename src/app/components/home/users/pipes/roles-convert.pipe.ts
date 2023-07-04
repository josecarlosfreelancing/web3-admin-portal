import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolesConvert'
})
export class RolesConvertPipe implements PipeTransform {

  transform(value: string | undefined) {
    let val = "";
    switch (value) {
      case 'admin':
          val = "Administrator";
        break;
      case 'admin-users':
          val = "User manager";
        break;
      case 'admin-dashboard':
        val = "Administrator dashboard";
        break;
      case 'admin-roles':
        val = "Show Roles";
        break;
      case 'user':
        val = 'App user'
        break;
      default:
          val = "---";
        break;
    }
    return val;
  }

}
