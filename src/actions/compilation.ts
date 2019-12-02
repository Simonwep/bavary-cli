/* eslint-disable no-console */
import {compile, Parser}   from '@bavary/core';
import {blueBright, green} from 'chalk';
import * as fs             from 'fs';
import glob                from 'glob';
import path                from 'path';
import {LEVEL, log}        from '../tools/log';
import {createPathString}  from '../tools/prettify-file-path';
import parse               from './parse';
import watchDeclarations   from './watch-declarations';
import watchSource         from './watch-source';

/**
 * Responsible for compilatation and watching source-files
 * @param input
 * @param globSource
 * @param watch
 * @param output
 * @param prettify
 */
export default (
    globSource: string, input: string,
    {watch, output, prettify}: {
        watch?: boolean;
        output?: string;
        prettify?: boolean;
    }
): void => {
    console.log(`Declarations: ${blueBright(globSource)}`);
    console.log(`Source: ${blueBright(input)}`);

    if (output) {
        output = path.resolve(output);
        const outputDir = path.dirname(output);

        if (!fs.existsSync(outputDir)) {
            log(`Invalid directory: ${outputDir}`, LEVEL.ERROR);
            process.exit(1);
        }

        console.log(`Output: ${blueBright(output)}`);
        console.log(` - Prettify: ${blueBright(!!prettify)}`);
    }

    console.log();

    if (watch) {
        log('Watching declartions and source file(s)...', LEVEL.INFO);
        let storedParser: Parser | null = null;
        let storedSource = '';

        watchDeclarations(globSource, parser => {
            storedParser = parser;
            parse(storedSource, parser, output, prettify);
        });

        watchSource(input, source => {
            storedSource = source;
            parse(storedSource, storedParser, output, prettify);
        });
    } else {

        // Resolve files and compile source
        glob(globSource, {}, (err, matches) => {

            if (err) {
                throw err;
            }

            for (const match of matches) {
                log(`Include ${createPathString(match)}`, LEVEL.INFO);
            }

            log('Compiling...', LEVEL.INFO);
            const source = fs.readFileSync(input, 'utf8');
            const declarations = matches
                .map(v => fs.readFileSync(v, 'utf8'))
                .join('\n');

            parse(source, compile(declarations), output, prettify);
            console.log(green('\nBye, bye!'));
            process.exit(0);
        });
    }

}
