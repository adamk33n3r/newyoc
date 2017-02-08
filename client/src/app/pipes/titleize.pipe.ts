import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'titleize',
})
export class TitleizePipe implements PipeTransform {
    public transform(val: string) {
        return val
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
            .replace(/^./, (str) => str.toUpperCase())
        ;
        // return val.split(' ').map((word) => {
        //     return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
        // });
    }
}
