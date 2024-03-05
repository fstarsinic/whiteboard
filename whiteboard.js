const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function convertYamlToJson(directory) {
    const filesAndDirs = fs.readdirSync(directory, { withFileTypes: true });

    filesAndDirs.forEach(dirent => {
        const fullPath = path.join(directory, dirent.name);
        if (dirent.isDirectory()) {
            // Recursively process directories
            convertYamlToJson(fullPath);
        } else if (path.extname(dirent.name) === '.yaml') {
            // Read and parse the YAML file
            const yamlContent = fs.readFileSync(fullPath, 'utf8');
            const jsonContent = yaml.load(yamlContent);

            // Convert to JSON and save with .yaml.json extension
            const jsonFilePath = `${fullPath}.json`;
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2), 'utf8');

            console.log(`Converted: ${jsonFilePath}`);
        }
    });
}

// Replace 'yourStartDirectory' with the path of your directory
const startDirectory = 'yourStartDirectory'; // Replace this with your actual directory path
convertYamlToJson(startDirectory);
