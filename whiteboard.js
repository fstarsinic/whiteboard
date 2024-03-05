const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function findYamlFilesAndDetails(directory, result = []) {
    const filesAndDirs = fs.readdirSync(directory, { withFileTypes: true });

    filesAndDirs.forEach(dirent => {
        const fullPath = path.join(directory, dirent.name);
        if (dirent.isDirectory()) {
            findYamlFilesAndDetails(fullPath, result); // Recursively search in directories
        } else if (path.extname(dirent.name) === '.yaml') {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const yamlContents = yaml.load(fileContents);
            const details = extractDetails(yamlContents);
            result.push(`${fullPath}: ${details}`);
        }
    });

    return result;
}

function extractDetails(yamlContents) {
    let details = [];

    // Top-level keys
    const topKeys = Object.keys(yamlContents).join(', ');
    details.push(topKeys);

    // info / tags
    if (yamlContents.info && yamlContents.info.tags) {
        const tags = yamlContents.info.tags.join(', ');
        details.push(`tags: ${tags}`);
    }

    // http / method and http / method / path
    if (yamlContents.http) {
        const methods = Object.keys(yamlContents.http).map(method => {
            let methodDetails = `method: ${method}`;
            if (yamlContents.http[method].path) {
                methodDetails += `, path: ${yamlContents.http[method].path}`;
            }
            return methodDetails;
        }).join('; ');
        details.push(methods);
    }

    return details.join('; ');
}

// Replace 'yourStartDirectory' with the path of your directory
const startDirectory = 'yourStartDirectory';
const yamlFilesAndDetails = findYamlFilesAndDetails(startDirectory);

console.log(yamlFilesAndDetails);
