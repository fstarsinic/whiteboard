import fs from 'fs';
import readline from 'readline';

class LargeFileProcessor {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public async processFile() {
    const fileStream = fs.createReadStream(this.filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber++;
      // Process the line here
      // For example, you could do something with the line

      if (lineNumber % 1000 === 0) {
        console.log(`Processed ${lineNumber} lines`);
      }
    }

    console.log(`File processing complete. Total lines processed: ${lineNumber}`);
  }
}

// Usage example:
const filePath = 'path/to/your/large/file.txt';
const processor = new LargeFileProcessor(filePath);

processor.processFile()
  .then(() => console.log('File has been processed successfully.'))
  .catch(error => console.error('An error occurred during file processing:', error));
