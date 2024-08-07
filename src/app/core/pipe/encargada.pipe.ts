import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encargada'
})
export class EncargadaPipe implements PipeTransform {

  transform(items: any[], param: string): any {
    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {
        return items.filter((item, index) => item.encargada === param);
    }
  }

}
