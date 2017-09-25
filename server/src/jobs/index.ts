import * as path from 'path';
import * as glob from 'glob';
import * as schedule from 'node-schedule';

import debug from 'src/logger';

export class Jobs {
    public static init() {
        const files = glob.sync(path.join(__dirname, '*.job.js'));
        for (const file of files) {
            const fileName = path.basename(file);
            debug('file:', file);
            debug('JOB:', fileName);
            require(file)(schedule);
        }
    }
}
