const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function findYamlFilesAndKeys(directory, result = []) {
    const filesAndDirs = fs.readdirSync(directory, { withFileTypes: true });

    filesAndDirs.forEach(dirent => {
        const fullPath = path.join(directory, dirent.name);
        if (dirent.isDirectory()) {
            findYamlFilesAndKeys(fullPath, result); // Recursively search in directories
        } else if (path.extname(dirent.name) === '.yaml') {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const yamlContents = yaml.load(fileContents);
            const topKeys = Object.keys(yamlContents).join(', '); // Get top-level keys and join them
            result.push(`${fullPath}: ${topKeys}`);
        }
    });

    return result;
}

// Replace 'yourStartDirectory' with the path of your directory
const startDirectory = 'yourStartDirectory'; 
const yamlFilesAndKeys = findYamlFilesAndKeys(startDirectory);

console.log(yamlFilesAndKeys);
