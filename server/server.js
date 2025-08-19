const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('../src/generated/prisma');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

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

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
