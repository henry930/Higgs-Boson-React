# How to Create Dynamic Pages - Quick Tutorial

## Step 1: Access the Admin Panel

1. Navigate to `/admin` in your browser
2. Click on the "**Pages**" tab
3. You'll see a list of existing pages (if any)

## Step 2: Create a New Page

1. Click the "**Create New Page**" button
2. You'll see the page editor interface

## Step 3: Fill in Basic Information

### Required Fields:
- **Title**: Enter your page title (e.g., "About Our Company")
- **Slug**: This auto-generates from the title (e.g., "about-our-company")
  - You can customize this if needed
  - The page will be accessible at `/{slug}`
- **Content**: Use the rich text editor to create your content

### Rich Text Editor Tips:
- Use the toolbar for formatting (bold, italic, headings, etc.)
- Insert links, images, and tables
- Create lists and blockquotes
- Add code blocks for technical content

## Step 4: Configure Settings (Optional)

### SEO Settings:
- **Meta Title**: Custom title for search engines
- **Meta Description**: Description for search results (160 chars max)

### Additional Info:
- **Excerpt**: Brief summary of the page
- **Author Name**: Page author
- **Cover Image**: URL to a cover image
- **Tags**: Comma-separated tags (e.g., "news, company, updates")

### Publication Settings:
- **Published**: Check to make the page live
- **Featured**: Check to mark as featured content

## Step 5: Save Your Page

1. Click "**Create**" to save the page
2. You'll see a success notification
3. The page will appear in the pages list

## Step 6: View Your Page

1. Click the slug link in the pages list, or
2. Navigate directly to `/{your-slug}` in the browser

## Managing Existing Pages

### Edit a Page:
1. Click "**Edit**" next to any page in the list
2. Make your changes
3. Click "**Update**" to save

### Delete a Page:
1. Click "**Delete**" next to any page
2. Confirm the deletion in the popup
3. The page will be permanently removed

### View Statistics:
- See page view counts in the pages list
- Views are tracked automatically after 3 seconds

## Content Tips

### Writing Good Content:
- Use headings (H1, H2, H3) to structure your content
- Keep paragraphs short and readable
- Add images to break up text
- Use bullet points for lists
- Include relevant links

### SEO Best Practices:
- Write descriptive meta titles (under 60 characters)
- Create compelling meta descriptions (under 160 characters)
- Use heading tags appropriately
- Include relevant keywords naturally

### URL Best Practices:
- Keep slugs short and descriptive
- Use hyphens to separate words
- Avoid special characters
- Make them readable and memorable

## Example Page Creation

Let's create a sample "Company News" page:

1. **Title**: "Latest Company News and Updates"
2. **Slug**: "company-news" (auto-generated)
3. **Content**:
   ```html
   <h1>Latest Company News and Updates</h1>
   
   <h2>Q3 2025 Highlights</h2>
   <p>We're excited to share our latest developments...</p>
   
   <h2>New Team Members</h2>
   <ul>
     <li>John Doe - Senior Developer</li>
     <li>Jane Smith - UX Designer</li>
   </ul>
   
   <blockquote>
     "This quarter has been our most successful yet!" - CEO
   </blockquote>
   ```
4. **Meta Title**: "Company News - Latest Updates | YourCompany"
5. **Meta Description**: "Stay updated with the latest news and developments from our company."
6. **Tags**: "news, company, updates, team"
7. **Published**: ✓ Checked
8. **Featured**: ✓ Checked (if this should be highlighted)

The page will be accessible at `/company-news`.

## Troubleshooting

### Page Not Showing:
- Make sure "Published" is checked
- Verify the slug doesn't conflict with existing routes
- Check that the API server is running

### Content Not Saving:
- Ensure all required fields are filled
- Check for any error notifications
- Try refreshing the page and trying again

### Formatting Issues:
- Use the editor toolbar for consistent formatting
- Preview your content before publishing
- Remember that HTML will be sanitized for security

## Security Notes

- All HTML content is automatically sanitized
- Only safe HTML tags and attributes are allowed
- Malicious scripts are automatically removed
- Published pages are publicly accessible

## Next Steps

Once you're comfortable with basic page creation:
1. Experiment with different content formats
2. Use the featured status for important pages
3. Monitor page views to see what content performs well
4. Create a content strategy using tags and excerpts
