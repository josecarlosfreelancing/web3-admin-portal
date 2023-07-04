import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disabledUser'
})
export class DisabledUserPipe implements PipeTransform {

  transform(value: boolean | undefined) {
    if (value) {
      return `<i class="fas fa-times text-danger"></i>`;
    }
    return `<i class="fas fa-check text-success"></i>`;
  }

}
