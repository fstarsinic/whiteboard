import * as fs from 'fs/promises';
import path from 'path';
// Assuming `normalize` is the correct function from json-normalizer library
// You might need to adjust import based on the actual library API
import { normalize } from 'json-normalizer';

async function writeJson(filenames: string[]): Promise<void> {
  for (const filename of filenames) {
    try {
      console.log(filename);
      const rawData = await fs.readFile(path.join('./raw_asn/', filename), { encoding: 'utf8' });
      const data = JSON.parse(rawData);

      if (data !== null) {
        const d: any = {};
        d["AS"] = data["handle"];

        // Use json-normalizer to normalize data.entities
        const normalizedData = normalize(data.entities);
        // Processing logic goes here, adapted to the output structure of json-normalizer

        // Example processing (This is just a placeholder, adjust according to your needs and the actual structure)
        d["entities"] = normalizedData.map((entity: any) => {
          // Simplified example to extract certain fields, actual implementation may vary
          return {
            org: entity["org"], // Assuming these fields are directly available after normalization
            phone: entity["phone"],
            email: entity["email"],
            address: entity["address"],
          };
        });

        // Write the transformed JSON to a file
        await fs.writeFile(path.join('./output_json1/', filename), JSON.stringify(d, null, 2));
      }
    } catch (error) {
      console.error(`Error in ${filename}`, error);
    }
  }
}
