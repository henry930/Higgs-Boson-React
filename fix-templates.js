const fs = require('fs');

// Read the file
const filePath = '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/test/api-comprehensive.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all malformed template literals
content = content.replace(/'`\$\{API_CONFIG\.BASE_URL\}`'/g, '`${API_CONFIG.BASE_URL}`');

// Write the file back
fs.writeFileSync(filePath, content);

console.log('Fixed template literals in comprehensive test file');
