/* eslint-disable no-console */
import {Parser}           from '@bavary/core/lib/types/compiler/types';
import {green}            from 'chalk';
import * as fs            from 'fs';
import {LEVEL, log}       from '../tools/log';
import {createPathString} from '../tools/prettify-file-path';

export const parse = (source = '', parser: Parser | null, output?: string, prettify?: boolean): void => {
    if (parser) {
        const result = parser(source);

        if (result === null) {
            log('Nothing matched', LEVEL.INFO);
        } else if (output) {
            const data = prettify ? JSON.stringify(result, null, 2) : JSON.stringify(result);

            // Write to disk
            fs.writeFileSync(output, data);
            log(`Result saved in ${createPathString(output)}`, LEVEL.OK);
        } else {
            console.log();
            console.log(green(
                JSON.stringify(result, null, 2)
            ));
        }
    } else {
        log('Waiting until files are compiled...', LEVEL.INFO);
    }
};
