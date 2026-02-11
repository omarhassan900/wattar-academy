const http = require('http');

console.log('Testing student API endpoint...');

// Test if we can get a student by ID
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/students/1',
    method: 'GET',
    headers: {
        'Cookie': 'connect.sid=test' // This won't work without proper session, but let's see the response
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response:', data);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();

console.log('API test sent. Check the response above.');