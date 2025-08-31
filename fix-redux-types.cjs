const fs = require('fs');
const path = require('path');

const files = [
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/processStepsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/testimonialsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/about/teamSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/services/servicesSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/pages/pagesSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/benefitsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/heroSlidesSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/processStepsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/testimonialsSlice.ts'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove type annotations from addCase fulfilled handlers
    content = content.replace(
      /\.addCase\([^,]+\.fulfilled,\s*\(state,\s*action:\s*PayloadAction<[^>]+>\)\s*=>/g,
      '.addCase($1.fulfilled, (state, action) =>'
    );
    
    // Fix specific patterns for fetch thunks
    content = content.replace(
      /export const (fetch\w+) = createAsyncThunk\(/g,
      'export const $1 = createAsyncThunk<any[]>('
    );
    
    // Add type casting for return statements
    content = content.replace(
      /return response\.data;/g,
      'return response.data as any[];'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${path.basename(filePath)}`);
  }
});

console.log('Fixed Redux slice type issues');
