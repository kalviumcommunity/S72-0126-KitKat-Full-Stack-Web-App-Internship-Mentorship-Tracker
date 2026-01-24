/**
 * Quick Mailtrap Test Script
 * Run this to test your Mailtrap integration
 * 
 * Usage: node test-mailtrap.js your-email@example.com
 */

const http = require('http');

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node test-mailtrap.js your-email@example.com');
  process.exit(1);
}

const data = JSON.stringify({ email });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/email/test',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🚀 Testing Mailtrap SMTP integration...');
console.log(`📧 Sending test email to: ${email}`);
console.log('');

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      
      if (response.success) {
        console.log('✅ Test email sent successfully!');
        console.log(`📬 Message ID: ${response.messageId}`);
        console.log('');
        console.log('🎉 Check your Mailtrap inbox to verify the email was received.');
        console.log('📱 Login to https://mailtrap.io/inboxes to view the email.');
      } else {
        console.error('❌ Failed to send test email');
        console.error(`Error: ${response.message}`);
        if (response.error) {
          console.error(`Details: ${response.error}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('');
  console.log('Make sure your server is running on port 3001');
  console.log('Run: npm run dev');
});

req.write(data);
req.end();