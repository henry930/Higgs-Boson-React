const fs = require('fs');

const files = [
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/processStepsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/testimonialsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/heroSlidesSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/benefitsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/processStepsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/testimonialsSlice.ts',
  '/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/pages/pagesSlice.ts'
];

const replacements = {
  'processStepsSlice.ts': [
    { from: /\.addCase\(\$1\.fulfilled/g, to: '.addCase(fetchProcessSteps.fulfilled' },
    { from: /\.addCase\(\$1\.pending/g, to: '.addCase(createProcessStep.pending' },
    { from: /\.addCase\(\$1\.rejected/g, to: '.addCase(updateProcessStep.rejected' }
  ],
  'testimonialsSlice.ts': [
    { from: /\.addCase\(\$1\.fulfilled/g, to: '.addCase(fetchTestimonials.fulfilled' },
    { from: /\.addCase\(\$1\.pending/g, to: '.addCase(createTestimonial.pending' },
    { from: /\.addCase\(\$1\.rejected/g, to: '.addCase(updateTestimonial.rejected' }
  ],
  'heroSlidesSlice.ts': [
    { from: /\.addCase\(\$1\.fulfilled/g, to: '.addCase(fetchHeroSlides.fulfilled' },
    { from: /\.addCase\(\$1\.pending/g, to: '.addCase(createHeroSlide.pending' },
    { from: /\.addCase\(\$1\.rejected/g, to: '.addCase(updateHeroSlide.rejected' }
  ],
  'benefitsSlice.ts': [
    { from: /\.addCase\(\$1\.fulfilled/g, to: '.addCase(fetchBenefits.fulfilled' },
    { from: /\.addCase\(\$1\.pending/g, to: '.addCase(createBenefit.pending' },
    { from: /\.addCase\(\$1\.rejected/g, to: '.addCase(updateBenefit.rejected' }
  ],
  'pagesSlice.ts': [
    { from: /\.addCase\(\$1\.fulfilled/g, to: '.addCase(fetchPages.fulfilled' },
    { from: /\.addCase\(\$1\.pending/g, to: '.addCase(createPage.pending' },
    { from: /\.addCase\(\$1\.rejected/g, to: '.addCase(updatePage.rejected' }
  ]
};

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = filePath.split('/').pop();
    
    // Just fix the $1 references generically
    content = content.replace(/\$1/g, 'action'); // Generic replacement
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed $1 references in ${fileName}`);
  }
});

console.log('Fixed all $1 references');
