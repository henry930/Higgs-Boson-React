#!/bin/bash

# 🎨 Figma Design Implementation Helper
# Interactive script to help implement your Figma design

echo "🎨 Figma Design Implementation Helper"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_question() {
    echo -e "${YELLOW}❓ $1${NC}"
}

# Step 1: Design Analysis
echo ""
print_question "Let's analyze your Figma design. What type of components do you see?"
echo "Common components include:"
echo "  - Hero Section"
echo "  - Navigation Bar"
echo "  - Service Cards" 
echo "  - About Section"
echo "  - Contact Form"
echo "  - Footer"
echo "  - Testimonials"
echo "  - Feature Lists"
echo "  - Image Galleries"
echo ""

read -p "List the main components you want to implement (comma-separated): " components

# Convert to array
IFS=',' read -ra COMPONENTS <<< "$components"

echo ""
print_info "Great! I'll help you implement these components:"
for component in "${COMPONENTS[@]}"; do
    component=$(echo "$component" | xargs) # trim whitespace
    echo "  - $component"
done

echo ""
read -p "Do you want to generate the component files now? (y/n): " generate_files

if [[ $generate_files == "y" || $generate_files == "Y" ]]; then
    echo ""
    print_info "Generating component files..."
    
    for component in "${COMPONENTS[@]}"; do
        component=$(echo "$component" | xargs) # trim whitespace
        # Convert to PascalCase for component names
        component_name=$(echo "$component" | sed 's/[^a-zA-Z0-9]//g')
        
        if [ -n "$component_name" ]; then
            echo "Generating $component_name..."
            npm run generate:component "$component_name" 2>/dev/null || {
                echo "Note: Component generator not found. Setting up..."
                node -e "
                const fs = require('fs');
                const path = require('path');
                
                const componentName = '$component_name';
                const componentDir = path.join('src', 'components', componentName);
                
                if (!fs.existsSync(componentDir)) {
                    fs.mkdirSync(componentDir, { recursive: true });
                }
                
                const componentContent = \`import React from 'react';
import styles from './$component_name.module.scss';

interface ${component_name}Props {
  className?: string;
  children?: React.ReactNode;
}

const $component_name: React.FC<${component_name}Props> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={\\\`\\\${styles.${component_name.toLowerCase()}} \\\${className}\\\`}>
      {/* TODO: Implement $component design from Figma */}
      {children}
    </div>
  );
};

export default $component_name;
\`;

                const scssContent = \`.${component_name.toLowerCase()} {
  /* TODO: Add styles from Figma design */
  
  /* Mobile first approach */
  padding: 1rem;
  
  /* Tablet */
  @media (min-width: 768px) {
    padding: 2rem;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    padding: 3rem;
  }
}
\`;

                fs.writeFileSync(path.join(componentDir, \`$component_name.tsx\`), componentContent);
                fs.writeFileSync(path.join(componentDir, \`$component_name.module.scss\`), scssContent);
                
                console.log('✅ Component $component_name created');
                "
            }
        fi
    done
    
    print_step "Component files generated!"
fi

echo ""
print_question "What's your preferred implementation method?"
echo "1. v0.dev (AI-powered, fastest)"
echo "2. Manual implementation (full control)"
echo "3. Copy from Figma Dev Mode"
echo ""

read -p "Choose option (1-3): " method

case $method in
    1)
        echo ""
        print_info "🤖 Using v0.dev approach:"
        echo ""
        echo "For each component:"
        echo "1. Go to https://v0.dev"
        echo "2. Describe your component from Figma:"
        echo ""
        for component in "${COMPONENTS[@]}"; do
            component=$(echo "$component" | xargs)
            echo "   Example for $component:"
            case $(echo "$component" | tr '[:upper:]' '[:lower:]') in
                *hero*|*banner*)
                    echo "   'Create a hero section with background image, heading, subtitle, and CTA buttons'"
                    ;;
                *nav*|*header*)
                    echo "   'Create a navigation bar with logo, menu items, and mobile hamburger menu'"
                    ;;
                *card*|*service*)
                    echo "   'Create a service card with icon, title, description, and button'"
                    ;;
                *form*|*contact*)
                    echo "   'Create a contact form with name, email, message fields and submit button'"
                    ;;
                *footer*)
                    echo "   'Create a footer with company info, links, and social media icons'"
                    ;;
                *)
                    echo "   'Create a $component component with [describe the visual elements from Figma]'"
                    ;;
            esac
            echo ""
        done
        echo "3. Copy generated code and replace the component files"
        echo "4. Adapt styling to match your Figma colors and spacing"
        ;;
    2)
        echo ""
        print_info "🎯 Using manual implementation:"
        echo ""
        echo "For each component:"
        echo "1. Open Figma and study the design details"
        echo "2. Note colors, fonts, spacing, and layout"
        echo "3. Implement step by step in the generated component files"
        echo "4. Use your existing SCSS patterns and variables"
        echo "5. Test in Storybook: npm run storybook"
        ;;
    3)
        echo ""
        print_info "💼 Using Figma Dev Mode:"
        echo ""
        echo "1. Open your Figma design"
        echo "2. Enable Dev Mode (if available)"
        echo "3. Select elements and copy CSS properties"
        echo "4. Convert CSS to SCSS modules format"
        echo "5. Implement React component structure"
        ;;
esac

echo ""
print_question "Do you want to set up design system variables from your Figma?"
read -p "(y/n): " setup_variables

if [[ $setup_variables == "y" || $setup_variables == "Y" ]]; then
    echo ""
    print_info "Creating design system file..."
    
    cat > src/styles/_figma-design-system.scss << 'EOF'
// 🎨 Design System Variables from Figma
// TODO: Replace with actual values from your Figma design

// Colors
$primary-color: #007bff;
$secondary-color: #6c757d;
$accent-color: #28a745;
$background-color: #ffffff;
$text-color: #333333;
$text-light: #666666;

// Typography
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$font-heading: 'Poppins', sans-serif;

$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-3xl: 2rem;
$font-size-4xl: 2.5rem;

// Spacing (based on 8px grid)
$space-1: 0.25rem; // 4px
$space-2: 0.5rem;  // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem;    // 16px
$space-5: 1.25rem; // 20px
$space-6: 1.5rem;  // 24px
$space-8: 2rem;    // 32px
$space-10: 2.5rem; // 40px
$space-12: 3rem;   // 48px
$space-16: 4rem;   // 64px

// Border radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;

// Shadows
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

// Breakpoints
$mobile: 480px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1280px;

// Z-index scale
$z-dropdown: 1000;
$z-sticky: 1020;
$z-fixed: 1030;
$z-modal: 1040;
$z-popover: 1050;
$z-tooltip: 1060;
EOF

    print_step "Design system file created at src/styles/_figma-design-system.scss"
    
    echo ""
    print_info "Don't forget to:"
    echo "1. Update the variables with actual values from your Figma"
    echo "2. Import in your component SCSS files:"
    echo "   @import '../../styles/figma-design-system';"
fi

echo ""
print_question "Do you want to start Storybook for component development?"
read -p "(y/n): " start_storybook

if [[ $start_storybook == "y" || $start_storybook == "Y" ]]; then
    echo ""
    print_info "Starting Storybook..."
    echo "This will open at http://localhost:6006"
    echo "You can develop and preview your components here."
    echo ""
    npm run storybook &
    echo ""
    print_step "Storybook started in background!"
fi

echo ""
print_step "🎉 Figma implementation setup complete!"
echo ""
print_info "Next steps:"
echo "1. 📱 Export assets from Figma to public/images/"
echo "2. 🎨 Implement each component using your chosen method"
echo "3. 🧪 Test components: npm test"
echo "4. 👀 Preview in Storybook: npm run storybook"
echo "5. 🚀 Deploy: git push (auto-deploys)"
echo ""
print_info "Need help? Check these files:"
echo "- FIGMA_IMPLEMENTATION_GUIDE.md"
echo "- DESIGN_AND_DEPLOYMENT.md"
echo "- QUICK_START_DESIGN_DEPLOYMENT.md"
echo ""
print_step "Happy coding! 🚀"
