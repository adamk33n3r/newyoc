import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeof',
})
export class TypeofPipe implements PipeTransform {
    public transform(val: any, type: string) {
        return typeof val === type;
    }
}
