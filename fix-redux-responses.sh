#!/bin/bash

# Fix all Redux slices to use only response.status instead of checking both success and status
FILES=(
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/benefitsSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/heroSlidesSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/processStepsSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/home/testimonialsSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/about/teamSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/services/servicesSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/features/pages/pagesSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/benefitsSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/heroSlidesSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/processStepsSlice.ts"
  "/Users/navcolon/Documents/higgsbosonconsultancy2/React/src/store/slices/testimonialsSlice.ts"
)

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "Fixing $FILE"
    # Replace the dual check with single status check
    sed -i '' 's/(response\.success === true || response\.status === '"'"'success'"'"')/response.status === '"'"'success'"'"'/g' "$FILE"
  else
    echo "File not found: $FILE"
  fi
done

echo "Fixed response.status checks in Redux slices"
