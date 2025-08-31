#!/bin/bash

# Fix all malformed template literals in test files
FILE="/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/test/api-comprehensive.test.ts"

# Replace the pattern: 'toHaveBeenCalledWith('`${API_CONFIG.BASE_URL}`/path'
# With: 'toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/path`'

sed -i '' "s/toHaveBeenCalledWith('\`\\\${API_CONFIG.BASE_URL}\`/toHaveBeenCalledWith(\`\\\${API_CONFIG.BASE_URL}\`/g" "$FILE"

echo "Fixed malformed template literals in test file"
