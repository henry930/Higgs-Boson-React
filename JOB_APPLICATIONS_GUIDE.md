# Job Applications Management Guide

## How to Access Saved Job Applications

All job applications submitted through the careers page are automatically saved to the browser's localStorage. Here's how to access them:

### Method 1: Browser Developer Console
1. Open your website: https://higgsbosonconsultancy.co.uk
2. Open Developer Tools (F12 or right-click → Inspect)
3. Go to the Console tab
4. Run one of these commands:

#### View All Applications:
```javascript
// Get all job applications
const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
console.table(applications);
console.log(`Total applications: ${applications.length}`);
```

#### Export Applications to JSON:
```javascript
// Export applications as downloadable JSON file
const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
const dataStr = JSON.stringify(applications, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'job_applications_' + new Date().toISOString().split('T')[0] + '.json';
link.click();
```

#### Clear All Applications (if needed):
```javascript
// WARNING: This will delete all saved applications
localStorage.removeItem('jobApplications');
console.log('All job applications have been cleared');
```

### Application Data Structure
Each application contains:
- `id`: Unique identifier
- `submittedAt`: Submission timestamp
- `firstName`: Applicant's first name
- `lastName`: Applicant's last name
- `email`: Contact email
- `phone`: Phone number
- `position`: Applied position
- `experience`: Experience level
- `coverLetter`: Cover letter text
- `linkedin`: LinkedIn profile URL
- `portfolio`: Portfolio URL
- `cvFileName`: Name of uploaded CV file (file content not stored)

### Method 2: Browser Storage Inspector
1. Open Developer Tools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Navigate to Local Storage → https://higgsbosonconsultancy.co.uk
4. Look for the `jobApplications` key
5. Click to view the JSON data

## Backup Recommendations
Since localStorage data can be lost if users clear their browser data, consider:
1. Regularly exporting the data using the console commands above
2. Setting up automated backups if you implement a server-side solution
3. Implementing email notifications when applications are submitted

## Future Enhancements
To implement a more robust solution, consider:
1. Adding a backend API to store applications in a database
2. Setting up email notifications for new applications
3. Creating an admin dashboard for managing applications
4. Implementing file upload storage for CVs
