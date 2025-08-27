// Quick check for available tech-stack-icons
const fs = require('fs');
const path = require('path');

// Look for the icon names from the package
try {
  const packagePath = path.join(__dirname, 'node_modules', 'tech-stack-icons');
  const packageJson = require(path.join(packagePath, 'package.json'));
  
  console.log('Tech Stack Icons version:', packageJson.version);
  
  // Try to find icon names
  const iconsList = [
    'csharp', 'c#', 'cs',
    'java', 
    'php',
    'go', 'golang',
    'swift',
    'kotlin',
    'terraform',
    'langchain',
    'pandas',
    'googlecloud', 'gcp',
    'microsoftazure', 'azure'
  ];
  
  console.log('Checking these icon names:', iconsList);
  
} catch (error) {
  console.error('Error:', error.message);
}
