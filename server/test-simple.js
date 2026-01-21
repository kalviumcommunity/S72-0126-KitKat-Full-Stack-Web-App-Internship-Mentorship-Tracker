// Simple test to verify Jest is working
console.log('Testing Jest setup...');

const { execSync } = require('child_process');

try {
  // Run a simple test
  const result = execSync('npx jest --testNamePattern="should have required environment variables" --verbose', {
    encoding: 'utf8',
    cwd: __dirname
  });
  
  console.log('✓ Jest is working correctly');
  console.log(result);
} catch (error) {
  console.error('✗ Jest test failed:');
  console.error(error.stdout || error.message);
  process.exit(1);
}