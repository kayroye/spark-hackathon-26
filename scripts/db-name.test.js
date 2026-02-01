const assert = require('assert');
const fs = require('fs');
const path = require('path');

const dbIndexPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'index.ts');
const source = fs.readFileSync(dbIndexPath, 'utf8');
const match = source.match(/const DB_NAME = ['"]([^'"]+)['"]/);

assert(match, 'DB_NAME constant not found in src/lib/db/index.ts');

const dbName = match[1];
const rxdbNameRegex = /^[a-z][_$a-zA-Z0-9\-]*$/;

assert(
  rxdbNameRegex.test(dbName),
  `DB_NAME "${dbName}" must match ${rxdbNameRegex}`
);
