#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Environment Setup Validation');
console.log('================================\n');

let hasErrors = false;
let hasWarnings = false;

// Utility functions
function checkExists(filePath, name, required = true) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    console.log(`✅ ${name} found`);
    return true;
  } else {
    if (required) {
      console.log(`❌ ${name} missing: ${filePath}`);
      hasErrors = true;
    } else {
      console.log(`⚠️  ${name} missing (optional): ${filePath}`);
      hasWarnings = true;
    }
    return false;
  }
}

function checkCommand(command, name, installInstructions) {
  try {
    execSync(command, { stdio: 'ignore' });
    console.log(`✅ ${name} available`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} not found`);
    console.log(`   Install: ${installInstructions}`);
    hasErrors = true;
    return false;
  }
}

function checkVersion(command, name, minVersion, installInstructions) {
  try {
    const output = execSync(command, { encoding: 'utf8' }).trim();
    const version = output.match(/[\d\.]+/)?.[0];
    if (version) {
      console.log(`✅ ${name} v${version}`);
      return true;
    } else {
      console.log(`⚠️  ${name} version could not be determined`);
      hasWarnings = true;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} not found`);
    console.log(`   Install: ${installInstructions}`);
    hasErrors = true;
    return false;
  }
}

// Check system requirements
console.log('📋 System Requirements');
console.log('----------------------');

checkVersion('node --version', 'Node.js', '16.0.0', 'https://nodejs.org/');
checkVersion('npm --version', 'npm', '8.0.0', 'comes with Node.js');
checkVersion('python3 --version', 'Python', '3.8.0', 'https://python.org/downloads/');
checkCommand('git --version', 'Git', 'https://git-scm.com/');

console.log();

// Check project files
console.log('📁 Project Structure');
console.log('--------------------');

checkExists('package.json', 'package.json');
checkExists('requirements.txt', 'requirements.txt');
checkExists('src/', 'src directory');
checkExists('server/', 'server directory');
checkExists('server/manage.py', 'Django manage.py');
checkExists('vite.config.ts', 'Vite config');
checkExists('tsconfig.json', 'TypeScript config');

console.log();

// Check virtual environment
console.log('🐍 Python Environment');
console.log('---------------------');

const venvExists = checkExists('venv/', 'Python virtual environment', false);
if (venvExists) {
  checkExists('venv/bin/activate', 'Virtual environment activation script', false) || 
  checkExists('venv/Scripts/activate', 'Virtual environment activation script (Windows)', false);
} else {
  console.log('   Run: python3 -m venv venv');
}

console.log();

// Check dependencies
console.log('📦 Dependencies');
console.log('---------------');

checkExists('node_modules/', 'Node.js dependencies', false);
if (!fs.existsSync('node_modules/')) {
  console.log('   Run: npm install');
}

if (venvExists) {
  try {
    execSync('source venv/bin/activate && pip list | grep -i django', { stdio: 'ignore' });
    console.log('✅ Django installed in virtual environment');
  } catch (error) {
    console.log('❌ Django not found in virtual environment');
    console.log('   Run: source venv/bin/activate && pip install -r requirements.txt');
    hasErrors = true;
  }
}

console.log();

// Check database
console.log('🗄️  Database');
console.log('------------');

checkExists('server/db.sqlite3', 'SQLite database', false);
if (!fs.existsSync('server/db.sqlite3')) {
  console.log('   Run: cd server && python manage.py migrate');
}

checkExists('server/api/migrations/', 'Django migrations directory', false);

console.log();

// Check configuration
console.log('⚙️  Configuration');
console.log('-----------------');

checkExists('.env', 'Environment variables file', false);
if (!fs.existsSync('.env')) {
  console.log('   Create .env file with necessary environment variables');
}

checkExists('.gitignore', 'Git ignore file', false);

console.log();

// Check development scripts
console.log('🚀 Development Scripts');
console.log('----------------------');

checkExists('setup.sh', 'Setup script', false);
checkExists('start-dev.sh', 'Development start script', false);
checkExists('start-backend.sh', 'Backend start script', false);
checkExists('start-frontend.sh', 'Frontend start script', false);

if (!fs.existsSync('setup.sh')) {
  console.log('   Run setup.sh to generate development scripts');
}

console.log();

// Check testing setup
console.log('🧪 Testing Setup');
console.log('----------------');

checkExists('src/test/', 'Test directory', false);
checkExists('src/test/setup.ts', 'Test setup file', false);

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasTestDeps = packageJson.devDependencies && 
    packageJson.devDependencies['vitest'] && 
    packageJson.devDependencies['@testing-library/react'];
  
  if (hasTestDeps) {
    console.log('✅ Testing dependencies configured');
  } else {
    console.log('⚠️  Testing dependencies missing');
    console.log('   Run: npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom');
    hasWarnings = true;
  }
} catch (error) {
  console.log('⚠️  Could not check testing dependencies');
  hasWarnings = true;
}

console.log();

// Port availability check
console.log('🔌 Port Availability');
console.log('--------------------');

try {
  execSync('lsof -ti:3000', { stdio: 'ignore' });
  console.log('⚠️  Port 3000 is in use');
  hasWarnings = true;
} catch (error) {
  console.log('✅ Port 3000 available');
}

try {
  execSync('lsof -ti:5173', { stdio: 'ignore' });
  console.log('⚠️  Port 5173 is in use');
  hasWarnings = true;
} catch (error) {
  console.log('✅ Port 5173 available');
}

try {
  execSync('lsof -ti:8000', { stdio: 'ignore' });
  console.log('⚠️  Port 8000 is in use');
  hasWarnings = true;
} catch (error) {
  console.log('✅ Port 8000 available');
}

console.log();

// Summary
console.log('📊 Summary');
console.log('----------');

if (hasErrors) {
  console.log('❌ Environment setup has ERRORS that need to be fixed');
  console.log('   Please address the issues above before proceeding');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Environment setup has warnings but should work');
  console.log('   Consider addressing the warnings for optimal experience');
  process.exit(0);
} else {
  console.log('✅ Environment setup looks good!');
  console.log('   You should be able to run: npm run dev');
  process.exit(0);
}
