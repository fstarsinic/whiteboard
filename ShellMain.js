import { execFile } from 'child_process';

/**
 * Executes a shell script with provided arguments and returns the results.
 * @param script The path to the shell script.
 * @param args An array of arguments to pass to the script.
 * @returns A promise that resolves with the script output or rejects with an error.
 */
function start(script: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            execFile(script, args, (error, stdout, stderr) => {
                if (error) {
                    reject(`Error: ${error.message}`);
                } else if (stderr) {
                    reject(`Script error output: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });
        } catch (err) {
            reject(`Execution failed: ${(err as Error).message}`);
        }
    });
}

// Example usage:
start('/path/to/your/script.sh', ['arg1', 'arg2'])
    .then(output => console.log('Script output:', output))
    .catch(err => console.error('Script error:', err));
