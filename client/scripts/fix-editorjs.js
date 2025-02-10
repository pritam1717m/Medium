const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(
    __dirname,
    '../node_modules/@editorjs/embed/package.json'
);

if (fs.existsSync(packageJsonPath)) {
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Fix the exports field
    packageJson.exports = {
        ".": {
            "import": "./dist/embed.mjs",
            "require": "./dist/embed.umd.js",
            "types": "./dist/index.d.ts"
        }
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Fixed @editorjs/embed package.json');
}
