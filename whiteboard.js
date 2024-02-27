import fs from 'fs';
import readline from 'readline';

class LargeFileProcessor {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // Asynchronous generator method to yield each line of the file
  async *lines(): AsyncGenerator<string, void, unknown> {
    const fileStream = fs.createReadStream(this.filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      yield line;
    }
  }

  public async processFile() {
    let lineNumber = 0;

    // Using the generator to process each line
    for await (const line of this.lines()) {
      lineNumber++;
      // Process the line here
      // For example, you might want to do something specific with the line

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
