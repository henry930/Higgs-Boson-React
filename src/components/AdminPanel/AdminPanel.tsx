import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Tabs, Tab } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  services: Array<{
    title: string;
    description: string;
  }>;
}

const AdminPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [contentData, setContentData] = useState<ContentData>({
    hero: {
      title: 'AI-Powered Solutions for Modern Businesses',
      subtitle: 'Transform your business with cutting-edge AI technology',
      backgroundImage: '/images/hero-bg.jpg'
    },
    contact: {
      email: 'info@higgsbosonconsultancy.co.uk',
      phone: '+44 123 456 7890',
      address: 'London, UK'
    },
    services: [
      { title: 'AI-Powered Developer Hiring', description: 'Find the perfect developers using AI matching' },
      { title: 'AI-Powered Project Estimation', description: 'Accurate project estimates with AI analysis' },
      { title: 'AI-Powered Issues Fixer', description: 'Automated problem detection and resolution' }
    ]
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (section: keyof ContentData, field: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      // In a real implementation, this would:
      // 1. Validate the data
      // 2. Update the JSON files
      // 3. Trigger a rebuild
      // 4. Deploy to S3
      
      console.log('Saving content:', contentData);
      
      // For now, just show an alert
      alert('Content saved! In a full implementation, this would update your website files and deploy automatically.');
      
      // Future implementation would call:
      // await updateWebsiteContent(contentData);
      // await triggerDeploy();
      
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content. Please try again.');
    }
  };

  const handleDeploy = async () => {
    try {
      // This would trigger the build and deployment process
      alert('Deployment started! Your changes will be live in a few minutes.');
      
      // Future implementation:
      // await triggerBuild();
      // await deployToS3();
      
    } catch (error) {
      console.error('Error deploying:', error);
      alert('Error deploying. Please check the console for details.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Website Admin Panel
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Update your website content easily without touching code
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Hero Section" />
            <Tab label="Contact Info" />
            <Tab label="Services" />
            <Tab label="Deploy" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>Hero Section</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Hero Title"
              value={contentData.hero.title}
              onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
            />
            <TextField
              fullWidth
              label="Hero Subtitle"
              value={contentData.hero.subtitle}
              onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Background Image URL"
              value={contentData.hero.backgroundImage}
              onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>Contact Information</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              value={contentData.contact.email}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
            />
            <TextField
              fullWidth
              label="Phone"
              value={contentData.contact.phone}
              onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
            />
            <TextField
              fullWidth
              label="Address"
              value={contentData.contact.address}
              onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>Services</Typography>
          {contentData.services.map((service, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={`Service ${index + 1} Title`}
                value={service.title}
                onChange={(e) => {
                  const newServices = [...contentData.services];
                  newServices[index].title = e.target.value;
                  setContentData(prev => ({ ...prev, services: newServices }));
                }}
                margin="normal"
              />
              <TextField
                fullWidth
                label={`Service ${index + 1} Description`}
                value={service.description}
                onChange={(e) => {
                  const newServices = [...contentData.services];
                  newServices[index].description = e.target.value;
                  setContentData(prev => ({ ...prev, services: newServices }));
                }}
                margin="normal"
                multiline
                rows={2}
              />
            </Paper>
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>Deploy Website</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Deploy your changes to make them live on your website.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mr: 2 }}
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleDeploy}
            >
              Deploy to Production
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: Always save your changes before deploying.
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
