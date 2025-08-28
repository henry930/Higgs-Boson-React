-- Create benefits table
CREATE TABLE IF NOT EXISTS benefits (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create process_steps table
CREATE TABLE IF NOT EXISTS process_steps (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    step_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    company VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    background_image TEXT,
    primary_button_text VARCHAR(100),
    primary_button_action VARCHAR(255),
    secondary_button_text VARCHAR(100),
    secondary_button_link VARCHAR(255),
    stats TEXT,
    slide_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for benefits
INSERT INTO benefits (title, description, icon) VALUES
('AI-Powered Development', 'Leverage cutting-edge AI technology to accelerate development and improve code quality.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>'),
('Cost Effective', 'Reduce development costs by up to 70% while maintaining enterprise-grade quality.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>'),
('Faster Time to Market', 'Launch your products 75% faster with our streamlined development process.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'),
('24/7 Support', 'Round-the-clock support and monitoring to ensure your applications run smoothly.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path></svg>');

-- Insert sample data for process_steps
INSERT INTO process_steps (title, description, icon, step_number) VALUES
('Discovery & Planning', 'We analyze your requirements and create a comprehensive project roadmap.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>', 1),
('AI-Driven Development', 'Our AI systems generate optimized code while our experts ensure quality and performance.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>', 2),
('Testing & Quality Assurance', 'Comprehensive testing ensures your application meets the highest standards.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>', 3),
('Deployment & Support', 'We deploy your application and provide ongoing support and maintenance.', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>', 4);

-- Insert sample data for testimonials
INSERT INTO testimonials (name, position, company, content, rating, featured) VALUES
('Sarah Johnson', 'CTO', 'TechStart Inc.', 'Higgs Boson Consultancy transformed our development process. Their AI-driven approach delivered results faster than we ever imagined possible.', 5, true),
('Michael Chen', 'Lead Developer', 'Innovation Labs', 'The quality of code and the speed of delivery exceeded all our expectations. Truly revolutionary approach to software development.', 5, true),
('Emily Rodriguez', 'Product Manager', 'Digital Solutions Co.', 'Working with Higgs Boson was a game-changer. They understood our vision and delivered beyond our expectations.', 5, true);

-- Insert sample data for hero_slides
INSERT INTO hero_slides (title, subtitle, background_image, primary_button_text, primary_button_action, secondary_button_text, secondary_button_link, stats, slide_order) VALUES
('AI-powered development that feels in-house', 'Experience the future of software development. Our AI-driven approach delivers enterprise-grade solutions with the precision and quality of your best in-house team.', '/images/how-it-works-hero-bg.jpg', 'Start Your Project', 'schedule', 'Learn More', '/how-it-works', '<strong>Trusted by 100+ innovative companies</strong> • <span class="stat-highlight">70% cost reduction</span> • <span class="stat-highlight">75% faster delivery</span>', 1),
('Transform Your Business with Innovative AI Solutions', 'Leverage cutting-edge artificial intelligence to automate processes, enhance decision-making, and unlock new opportunities for growth and efficiency.', '/images/step3-strategy.jpg', 'Get AI Consultation', 'schedule', 'View Services', '/services', '<strong>AI-First Approach</strong> • <span class="stat-highlight">500+ AI models deployed</span> • <span class="stat-highlight">95% accuracy rate</span>', 2),
('Build the Future with Transformative Technology', 'From web applications to mobile apps, cloud infrastructure to data analytics - we provide comprehensive technology solutions that scale with your business.', '/images/step4-development.jpg', 'Start Building', 'schedule', 'Price Calculator', '/price-comparison', '<strong>Full-Stack Excellence</strong> • <span class="stat-highlight">200+ technologies mastered</span> • <span class="stat-highlight">99.9% uptime</span>', 3);

-- Enable Row Level Security
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view benefits" ON benefits FOR SELECT USING (true);
CREATE POLICY "Anyone can view process_steps" ON process_steps FOR SELECT USING (true);
CREATE POLICY "Anyone can view testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Anyone can view hero_slides" ON hero_slides FOR SELECT USING (true);
