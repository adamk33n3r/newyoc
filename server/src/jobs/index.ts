import * as path from 'path';
import * as glob from 'glob';
import * as schedule from 'node-schedule';

export class Jobs {
    public static init() {
        const files = glob.sync(path.join(__dirname, '*.job.js'));
        for (const file of files) {
            const fileName = path.basename(file);
            console.log('file:', file);
            console.log('JOB:', fileName);
            require(file)(schedule);
        }
    }
}
