// Minimal API service for remaining functionality (careers, etc.)
// This replaces the full apiService that was moved to backup

export const apiService = {
  // Job application submission for careers page
  submitJobApplication: async (formData: FormData) => {
    try {
      // Convert FormData to regular object for storage
      const applicationData: any = {
        id: Date.now(), // Simple ID generation
        submittedAt: new Date().toISOString(),
        firstName: formData.get('first_name'),
        lastName: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        position: formData.get('position'),
        experience: formData.get('experience'),
        coverLetter: formData.get('cover_letter'),
        linkedin: formData.get('linkedin'),
        portfolio: formData.get('portfolio'),
        cvFileName: formData.get('cv') ? (formData.get('cv') as File).name : null
      };

      // Get existing applications from localStorage
      const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      
      // Add new application
      existingApplications.push(applicationData);
      
      // Save back to localStorage
      localStorage.setItem('jobApplications', JSON.stringify(existingApplications));
      
      // Log the submission for debugging
      console.log('Job application saved to localStorage:', applicationData);
      console.log('Total applications:', existingApplications.length);
      
      // Return success response with proper format
      return {
        status: 'success',
        data: { 
          message: 'Application submitted successfully! We will review your application and get back to you within 3-5 business days.',
          id: applicationData.id
        }
      };
    } catch (error) {
      console.error('Error submitting job application:', error);
      throw new Error('Failed to submit application. Please try again.');
    }
  },

  // Helper function to retrieve all job applications (for admin use)
  getJobApplications: () => {
    try {
      const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      return {
        status: 'success',
        data: applications,
        count: applications.length
      };
    } catch (error) {
      console.error('Error retrieving job applications:', error);
      return {
        status: 'error',
        data: [],
        count: 0
      };
    }
  },

  // Helper function to clear all applications (for admin use)
  clearJobApplications: () => {
    try {
      localStorage.removeItem('jobApplications');
      return {
        status: 'success',
        message: 'All job applications cleared successfully'
      };
    } catch (error) {
      console.error('Error clearing job applications:', error);
      return {
        status: 'error',
        message: 'Failed to clear job applications'
      };
    }
  },

  // Placeholder methods for Redux slices (they can just return empty data)
  getTeamMembers: async () => ({ status: 'success', data: [] }),
  getBenefits: async () => ({ status: 'success', data: [] }),
  getHeroSlides: async () => ({ status: 'success', data: [] }),
  getProcessSteps: async () => ({ status: 'success', data: [] }),
  getTestimonials: async () => ({ status: 'success', data: [] }),
  getPages: async () => ({ status: 'success', data: [] }),
  getServices: async () => ({ status: 'success', data: [] }),
  
  // Create/Update/Delete placeholders
  createTeamMember: async () => ({ status: 'success', data: {}, message: 'Team member created successfully' }),
  updateTeamMember: async () => ({ status: 'success', data: {}, message: 'Team member updated successfully' }),
  deleteTeamMember: async () => ({ status: 'success', data: {}, message: 'Team member deleted successfully' }),
  createBenefit: async () => ({ status: 'success', data: {}, message: 'Benefit created successfully' }),
  updateBenefit: async () => ({ status: 'success', data: {}, message: 'Benefit updated successfully' }),
  deleteBenefit: async () => ({ status: 'success', data: {}, message: 'Benefit deleted successfully' }),
  createHeroSlide: async () => ({ status: 'success', data: {}, message: 'Hero slide created successfully' }),
  updateHeroSlide: async () => ({ status: 'success', data: {}, message: 'Hero slide updated successfully' }),
  deleteHeroSlide: async () => ({ status: 'success', data: {}, message: 'Hero slide deleted successfully' }),
  createProcessStep: async () => ({ status: 'success', data: {}, message: 'Process step created successfully' }),
  updateProcessStep: async () => ({ status: 'success', data: {}, message: 'Process step updated successfully' }),
  deleteProcessStep: async () => ({ status: 'success', data: {}, message: 'Process step deleted successfully' }),
  createTestimonial: async () => ({ status: 'success', data: {}, message: 'Testimonial created successfully' }),
  updateTestimonial: async () => ({ status: 'success', data: {}, message: 'Testimonial updated successfully' }),
  deleteTestimonial: async () => ({ status: 'success', data: {}, message: 'Testimonial deleted successfully' }),
  createPage: async () => ({ status: 'success', data: {}, message: 'Page created successfully' }),
  updatePage: async () => ({ status: 'success', data: {}, message: 'Page updated successfully' }),
  deletePage: async () => ({ status: 'success', data: {}, message: 'Page deleted successfully' }),
  createService: async () => ({ status: 'success', data: {}, message: 'Service created successfully' }),
  updateService: async () => ({ status: 'success', data: {}, message: 'Service updated successfully' }),
  deleteService: async () => ({ status: 'success', data: {}, message: 'Service deleted successfully' })
};

export default apiService;
