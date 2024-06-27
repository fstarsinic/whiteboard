import json
import argparse
import os

def get_all_keys(obj, prefix=''):
    keys = []
    for key in obj:
        new_key = f"{prefix}.{key}" if prefix else key
        keys.append(new_key)
        if isinstance(obj[key], dict):
            keys.extend(get_all_keys(obj[key], new_key))
    return keys

def main():
    parser = argparse.ArgumentParser(description='Process a JSON file and output all keys in dot-separated format.')
    parser.add_argument('--file', '-f', required=True, help='Path to the JSON file')

    args = parser.parse_args()
    file_path = args.file

    if not os.path.exists(file_path):
        print('File does not exist.')
        return

    try:
        with open(file_path, 'r') as file:
            json_data = json.load(file)
        keys = get_all_keys(json_data)
        print('\n'.join(keys))
    except Exception as error:
        print('Error reading or parsing file:', error)

if __name__ == "__main__":
    main()
