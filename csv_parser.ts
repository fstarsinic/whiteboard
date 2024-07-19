import * as fs from 'fs';
import { parse } from 'csv-parse';

interface CsvObject {
  [key: string]: string;
}

async function readCsvFile(filePath: string): Promise<CsvObject[]> {
  return new Promise((resolve, reject) => {
    const results: CsvObject[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Example usage
readCsvFile('path/to/your/file.csv')
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error reading CSV file:', error);
  });
