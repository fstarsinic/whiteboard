import * as fs from 'fs/promises';
import * as dfd from 'danfojs-node';
import path from 'path';

async function writeJson(filenames: string[]): Promise<void> {
  for (const filename of filenames) {
    try {
      console.log(filename);
      const rawData = await fs.readFile(path.join('./raw_asn/', filename), { encoding: 'utf8' });
      const data = JSON.parse(rawData);

      if (data !== null) {
        const d: any = {};
        d["AS"] = data["handle"];

        if (data.entities) {
          const entitiesDf = new dfd.DataFrame(data.entities);
          const entities = entitiesDf['entities'].values;
          const jsonList: any[] = [];

          entities.forEach((entity: any) => {
            if (entity.vcardArray) {
              jsonList.push(...entity.vcardArray);
            }
          });

          let phone: string[] = [];
          jsonList.forEach(js => {
            if (js) {
              js.forEach((card: any) => {
                if (card.includes("fn")) {
                  d["org"] = card[3];
                }
                if (card.includes("tel")) {
                  phone.push(card[3]);
                  d["phone"] = phone;
                }
                if (card.includes("email")) {
                  d["email"] = card[3];
                }
                if (card.includes("adr")) {
                  d["address"] = card[3]; // Simplification, needs logic to handle 'label' and join
                }
              });
            }
          });

          // Additional processing for entities
          // This would involve further logic to normalize and iterate through entities
          // and their roles, similar to the original Python code.
          // Placeholder for additional entity processing...
        }

        // Write the transformed JSON to a file
        await fs.writeFile(path.join('./output_json1/', filename), JSON.stringify(d, null, 2));
      }
    } catch (error) {
      console.error(`Error in ${filename}`, error);
    }
  }
}

// You may need to adjust the logic to better match your specific JSON structure
// and processing requirements, especially in handling complex nested structures.
