import fs from 'fs';
import path from 'path';

// Assuming a placeholder for JSON normalization similar to pandas json_normalize
// You might need to implement or find a suitable library function for complex cases.
function normalizeJson(json: any): any {
  // Placeholder implementation - you will need to replace this with actual normalization logic
  return json.entities?.map((entity: any) => entity.vcardArray) ?? [];
}

async function writeJson(filenames: string[]): Promise<void> {
  for (const filename of filenames) {
    try {
      console.log(filename);
      const rawData = fs.readFileSync(path.join('./raw_asn/', filename), { encoding: 'utf8' });
      const data = JSON.parse(rawData);

      if (data) {
        const d: any = {};
        d["AS"] = data["handle"];
        const jsonList = normalizeJson(data);

        // Other processing logic as per your Python script
        // This part needs to be adapted based on how your JSON structure looks and what you actually need to extract
        // For simplicity, this is a placeholder to indicate you would perform your transformations here

        // Example transformation
        if (data["entities"]) {
          d["entities"] = data["entities"].map((entity: any) => {
            return {
              name: entity["name"], // Assuming these fields exist
              // Other fields as needed
            };
          });
        }

        // Write the transformed JSON to a file
        fs.writeFileSync(path.join('./output_json1/', filename), JSON.stringify(d));
      }
    } catch (error) {
      console.error(`Error in ${filename}`, error);
    }
  }
}
