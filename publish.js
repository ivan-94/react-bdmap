#!/usr/bin/env node

const { execSync } = require('child_process')
const { copyFileSync } = require('fs')

execSync(`npm run build`, {
  stdio: 'inherit',
})
copyFileSync('package.json', './dist/package.json')
process.chdir('./dist')
execSync(`npm publish --access public`, { stdio: 'inherit' })
