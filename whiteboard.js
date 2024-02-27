import fs from 'fs';
import csvParser from 'csv-parser';

class CSVFileProcessor {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // Asynchronous generator method to yield each row of the CSV file
  async *rows(): AsyncGenerator<any, void, unknown> {
    const fileStream = fs.createReadStream(this.filePath);
    const parser = fileStream.pipe(csvParser());

    for await (const row of parser) {
      yield row;
    }
  }
}

// External processing function example
async function processCSVFile(filePath: string) {
  const processor = new CSVFileProcessor(filePath);
  let documentCount = 0;

  for await (const row of processor.rows()) {
    // Assuming each row is an object with at least two properties
    // and you're interested only in rows with length >= 2
    const keys = Object.keys(row);
    if (keys.length >= 2) {
      const document = {
        startip: row[keys[0]], // Adjust these based on your CSV structure
        endip: row[keys[1]],
      };

      documentCount++;

      // Process the document here (e.g., log it or accumulate for bulk operation)
      console.log(document);

      // Example: Log a message every 1000 documents
      if (documentCount % 1000 === 0) {
        console.log(`Processed ${documentCount} documents`);
      }
    }
  }

  console.log(`CSV file processing complete. Total documents processed: ${documentCount}`);
}

// Example usage
const filePath = 'path/to/your/large/file.csv';
processCSVFile(filePath)
  .then(() => console.log('CSV file has been processed successfully.'))
  .catch(error => console.error('An error occurred during CSV file processing:', error));
