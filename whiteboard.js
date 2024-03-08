import * as fs from 'fs/promises';
import * as path from 'path';

async function writeJson(filenames: string[], pathOfTheDirectory: string): Promise<void> {
  for (const filename of filenames) {
    console.log(filename);
    const fn = path.join(pathOfTheDirectory, filename);
    console.log(`${fn} is being processed`);
    try {
      try {
        await fs.access(fn);
      } catch (error) {
        console.log(`${fn} file does not exist`);
        continue;
      }

      const rawData = await fs.readFile(fn, { encoding: 'utf8' });
      const data = JSON.parse(rawData);
      if (data !== null) {
        const d: any = { "AS": data["handle"] };
        const entities = data["entities"] ?? [];
        const jsonList: any[] = [];

        entities.forEach((entity: any) => {
          entity["vcardArray"]?.forEach((vcard: any) => {
            if (vcard) {
              jsonList.push(vcard);
            }
          });
        });

        const phone: string[] = [];
        jsonList.forEach(m => {
          if (Array.isArray(m[1])) {
            m[1].forEach((l: any) => {
              if (l.includes("fn")) {
                d["org"] = l[3];
              }
              if (l.includes("tel")) {
                phone.push(l[3]);
                d["phone"] = phone;
              }
              if (l.includes("email")) {
                d["email"] = l[3];
              }
              if (l.includes("adr")) {
                d["address"] = Array.isArray(l[1]) ? l[1].join(' ') : l[3];
              }
            });
          }
        });

        const entitiesData: any[] = [];
        entities.forEach((entity: any) => {
          const ind: any = {};
          if (entity["vcardArray"]) {
            entity["vcardArray"].forEach((vcard: any) => {
              if (Array.isArray(vcard[1])) {
                vcard[1].forEach((item: any) => {
                  if (item.includes("fn")) {
                    ind["name"] = item[3];
                  }
                  if (item.includes("adr")) {
                    ind["address"] = item[3]; // Simplify for this example
                  }
                  if (item.includes("email")) {
                    ind["email"] = item[3];
                  }
                  if (item.includes("tel")) {
                    ind["phone"] = [item[3]];
                  }
                });
              }
            });
          }
          if (entity["roles"]) {
            ind["type"] = entity["roles"][0];
          }
          if (Object.keys(ind).length > 0) {
            entitiesData.push(ind);
          }
        });

        d["entities"] = entitiesData;

        await fs.writeFile(path.join('output_json', filename), JSON.stringify(d, null, 2));
      }
    } catch (error) {
      console.error(`Error in ${filename}`, error);
    }
  }
}

// Example usage
const pathOfTheDirectory = './raw_asn';
const filenames = ['example1.json', 'example2.json'];
writeJson(filenames, pathOfTheDirectory).then(() => console.log('Done'));
