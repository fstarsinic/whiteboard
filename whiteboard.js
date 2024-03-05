const fs = require('fs');
const yaml = require('js-yaml');

// Function to convert YAML file to JSON file
function convertYamlToJson(yamlFilePath, jsonFilePath) {
    try {
        // Read the YAML file
        const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
        // Parse the YAML content to a JavaScript object
        const jsonObj = yaml.load(yamlContent);
        // Convert the JavaScript object to a JSON string
        const jsonContent = JSON.stringify(jsonObj, null, 2); // null, 2 for pretty-print
        // Write the JSON string to a file
        fs.writeFileSync(jsonFilePath, jsonContent, 'utf8');
        console.log(`Converted YAML to JSON successfully. Output file: ${jsonFilePath}`);
    } catch (error) {
        console.error('Error converting YAML to JSON:', error);
    }
}

// Replace these paths with your actual file paths
const yamlFilePath = 'path/to/your/nuclei-templates.yaml';
const jsonFilePath = 'path/to/your/output-nuclei-templates.json';

// Call the function to start the conversion
convertYamlToJson(yamlFilePath, jsonFilePath);
