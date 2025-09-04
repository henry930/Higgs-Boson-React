const express = require('express');
const cors = require('cors');
const createDOMPurify = require('isomorphic-dompurify');
const { JSDOM } = require('jsdom');
const { PrismaClient } = require('../src/generated/prisma');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Setup DOMPurify for server-side HTML sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Benefits endpoints
app.get('/api/benefits', async (req, res) => {
  try {
    const benefits = await prisma.benefit.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: benefits });
  } catch (error) {
    console.error('Error fetching benefits:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/benefits', async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const benefit = await prisma.benefit.create({
      data: { title, description, icon }
    });
    res.json({ status: 'success', data: benefit });
  } catch (error) {
    console.error('Error creating benefit:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.put('/api/benefits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;
    const benefit = await prisma.benefit.update({
      where: { id: parseInt(id) },
      data: { title, description, icon }
    });
    res.json({ status: 'success', data: benefit });
  } catch (error) {
    console.error('Error updating benefit:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/benefits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.benefit.delete({
      where: { id: parseInt(id) }
    });
    res.json({ status: 'success', message: 'Benefit deleted' });
  } catch (error) {
    console.error('Error deleting benefit:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Process Steps endpoints
app.get('/api/process-steps', async (req, res) => {
  try {
    const processSteps = await prisma.processStep.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: processSteps });
  } catch (error) {
    console.error('Error fetching process steps:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/process-steps', async (req, res) => {
  try {
    const { number, title, description, order } = req.body;
    const processStep = await prisma.processStep.create({
      data: { number, title, description, order }
    });
    res.json({ status: 'success', data: processStep });
  } catch (error) {
    console.error('Error creating process step:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.put('/api/process-steps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, title, description, order } = req.body;
    const processStep = await prisma.processStep.update({
      where: { id: parseInt(id) },
      data: { number, title, description, order }
    });
    res.json({ status: 'success', data: processStep });
  } catch (error) {
    console.error('Error updating process step:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/process-steps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.processStep.delete({
      where: { id: parseInt(id) }
    });
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting process step:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Testimonials endpoints
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/testimonials/featured', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { featured: true, active: true },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: testimonials });
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { quote, authorName, authorTitle, authorImage, order, featured } = req.body;
    const testimonial = await prisma.testimonial.create({
      data: { quote, authorName, authorTitle, authorImage, order, featured: !!featured }
    });
    res.json({ status: 'success', data: testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Hero Slides endpoints
app.get('/api/hero-slides', async (req, res) => {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: heroSlides });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/hero-slides', async (req, res) => {
  try {
    const { title, subtitle, backgroundImage, order } = req.body;
    const heroSlide = await prisma.heroSlide.create({
      data: { title, subtitle, backgroundImage, order }
    });
    res.json({ status: 'success', data: heroSlide });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.put('/api/hero-slides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const heroSlide = await prisma.heroSlide.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json({ status: 'success', data: heroSlide });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/hero-slides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.heroSlide.delete({
      where: { id: parseInt(id) }
    });
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Pages endpoints
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ status: 'success', data: pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/pages/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await prisma.page.findUnique({
      where: { slug }
    });
    if (!page) {
      return res.status(404).json({ status: 'error', message: 'Page not found' });
    }
    res.json({ status: 'success', data: page });
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/pages', async (req, res) => {
  try {
    const { 
      title, 
      slug, 
      content, 
      metaTitle, 
      metaDescription, 
      published = false, 
      featured = false,
      authorName,
      coverImage,
      excerpt,
      tags
    } = req.body;

    // Sanitize HTML content
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
        'tr', 'td', 'th', 'div', 'span', 'pre', 'code'
      ],
      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'id', 'style']
    });

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    });
    if (existingPage) {
      return res.status(400).json({ status: 'error', message: 'Page with this slug already exists' });
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content: sanitizedContent,
        metaTitle,
        metaDescription,
        published: Boolean(published),
        featured: Boolean(featured),
        authorName,
        coverImage,
        excerpt,
        tags
      }
    });
    res.json({ status: 'success', data: page });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.put('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Sanitize HTML content if provided
    if (updateData.content) {
      updateData.content = DOMPurify.sanitize(updateData.content, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
          'tr', 'td', 'th', 'div', 'span', 'pre', 'code'
        ],
        ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'id', 'style']
      });
    }

    // Check if slug already exists (if slug is being updated)
    if (updateData.slug) {
      const existingPage = await prisma.page.findFirst({
        where: { 
          slug: updateData.slug,
          NOT: { id: parseInt(id) }
        }
      });
      if (existingPage) {
        return res.status(400).json({ status: 'error', message: 'Page with this slug already exists' });
      }
    }

    const page = await prisma.page.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    res.json({ status: 'success', data: page });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.delete('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.page.delete({
      where: { id: parseInt(id) }
    });
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/pages/slug/:slug/views', async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await prisma.page.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
    res.json({ status: 'success', data: page });
  } catch (error) {
    console.error('Error incrementing page views:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
