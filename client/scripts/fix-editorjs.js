const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(
    __dirname,
    '../node_modules/@editorjs/embed/package.json'
);

if (fs.existsSync(packageJsonPath)) {
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Remove problematic "exports" field
    if (packageJson.exports) {
        delete packageJson.exports;
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Fixed @editorjs/embed package.json');
}
