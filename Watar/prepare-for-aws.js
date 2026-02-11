const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('  PREPARING WATTAR ACADEMY FOR AWS DEPLOYMENT');
console.log('='.repeat(60));
console.log();

// Files and folders to include in deployment
const filesToInclude = [
    'server.js',
    'package.json',
    'wattar.db',
    'views/',
    'public/',
    'README.md',
    'PRODUCTION-READY.md',
    'AWS-DEPLOYMENT-GUIDE.md'
];

// Files to exclude
const filesToExclude = [
    'node_modules/',
    '.git/',
    '*.log',
    'test-*.js',
    'create-*.js',
    'fix-*.js',
    'add-*.js',
    'setup-*.js',
    'update-*.js',
    'migrate-*.js',
    'import-*.js',
    'extract-*.js',
    'check-*.js',
    '*.xlsx',
    '*.csv',
    'docs/'
];

console.log('✓ Checking required files...\n');

// Check if required files exist
const requiredFiles = ['server.js', 'package.json', 'wattar.db'];
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✓ ${file}`);
    } else {
        console.log(`  ✗ ${file} - MISSING!`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n✗ Some required files are missing!');
    process.exit(1);
}

console.log('\n' + '='.repeat(60));
console.log('  DEPLOYMENT PACKAGE READY');
console.log('='.repeat(60));
console.log('\nFiles to deploy:');
console.log('  • server.js');
console.log('  • package.json');
console.log('  • wattar.db');
console.log('  • views/ (all .ejs files)');
console.log('  • public/ (if exists)');
console.log('  • Documentation files');

console.log('\n' + '='.repeat(60));
console.log('  NEXT STEPS FOR AWS DEPLOYMENT');
console.log('='.repeat(60));
console.log('\n1. Create AWS Lightsail instance ($5/month recommended)');
console.log('2. Connect via SSH');
console.log('3. Install Node.js and PM2');
console.log('4. Upload these files to /home/ubuntu/wattar-academy/');
console.log('5. Run: npm install');
console.log('6. Run: pm2 start server.js --name wattar-academy');
console.log('7. Access: http://YOUR-IP:3000');

console.log('\n📖 Read AWS-DEPLOYMENT-GUIDE.md for detailed instructions');

console.log('\n' + '='.repeat(60));
console.log('  QUICK UPLOAD METHODS');
console.log('='.repeat(60));
console.log('\nOption 1: Using SCP (from your computer)');
console.log('  scp -i your-key.pem -r D:\\Watar ubuntu@YOUR-IP:/home/ubuntu/');
console.log('\nOption 2: Using Git');
console.log('  1. Push code to GitHub');
console.log('  2. On server: git clone your-repo-url');
console.log('\nOption 3: Manual upload via Lightsail SSH console');
console.log('  Use the upload feature in the browser SSH terminal');

console.log('\n' + '='.repeat(60));
console.log('  IMPORTANT REMINDERS');
console.log('='.repeat(60));
console.log('\n⚠️  Before deployment:');
console.log('  [ ] Change admin password');
console.log('  [ ] Update session secret in server.js');
console.log('  [ ] Configure firewall (port 3000)');
console.log('  [ ] Set up automated backups');

console.log('\n✅ Your application is ready for AWS deployment!');
console.log('\n' + '='.repeat(60));
