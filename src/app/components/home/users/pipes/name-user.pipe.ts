import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameUser'
})
export class NameUserPipe implements PipeTransform {

  transform(value: string | undefined) {
    if (!!value && value != " ") {
      return value;
    } else {
      return '---';
    }
  }

}
