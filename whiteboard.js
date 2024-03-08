import json
import os
import time

def writeJson(filenames, path_of_the_directory):
    for filename in filenames:
        print(filename)
        fn = f'{path_of_the_directory}{os.sep}{filename}'
        print(f'{fn} is being processed')
        try:
            if not os.path.exists(fn):
                print(f'{fn} file does not exist')
                continue
            with open(fn, 'r') as f:
                print(filename)
                time.sleep(1)
                data = json.loads(f.read())
                if data is not None:
                    d = {"AS": data["handle"]}
                    entities = data.get("entities", [])
                    jsonList = []
                    for entity in entities:
                        for vcard in entity.get("vcardArray", []):
                            if vcard:
                                jsonList.append(vcard)

                    phone = []
                    for m in jsonList:
                        if isinstance(m[1], list):
                            for l in m[1]:
                                if "fn" in l:
                                    d["org"] = l[3]
                                if "tel" in l:
                                    phone.append(l[3])
                                    d["phone"] = phone
                                if "email" in l:
                                    d["email"] = l[3]
                                if "adr" in l:
                                    if l[1]:
                                        d["address"] = l[1].get("label", "")
                                    else:
                                        d["address"] = ' '.join((str(n) for n in l[3]))

                    entities_data = []
                    for entity in entities:
                        ind = {}
                        if "vcardArray" in entity:
                            for vcard in entity["vcardArray"]:
                                if isinstance(vcard[1], list):
                                    for item in vcard[1]:
                                        if "fn" in item:
                                            ind["name"] = item[3]
                                        if "adr" in item:
                                            ind["address"] = item[1].get("label", ' '.join(str(n) for n in item[3]))
                                        if "email" in item:
                                            ind["email"] = item[3]
                                        if "tel" in item:
                                            ind["phone"] = [item[3]]
                        if "roles" in entity:
                            ind["type"] = entity["roles"][0]
                        if ind:
                            entities_data.append(ind)

                    d["entities"] = entities_data

                    with open(f'output_json/{filename}', 'w') as outfile:
                        json.dump(d, outfile, indent=4)
        except Exception as e:
            print(f"Error in {filename}")
            print(e)

# Example usage
path_of_the_directory = './raw_asn'
filenames = ['example1.json', 'example2.json']
writeJson(filenames, path_of_the_directory)
