const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('./coverage/lcov.info', 'utf-8');
const lines = content.split('\n');

const files = [];
let currentFile = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  if (line.startsWith('SF:')) {
    const filepath = line.substring(3);
    if (!filepath.endsWith('.spec.ts') && filepath.includes('src\\app\\')) {
      currentFile = {
        file: filepath,
        fnf: 0,
        fnh: 0,
        lf: 0,
        lh: 0,
        brf: 0,
        brh: 0,
      };
    } else {
      currentFile = null;
    }
  } else if (currentFile) {
    if (line.startsWith('FNF:')) currentFile.fnf = parseInt(line.substring(4));
    else if (line.startsWith('FNH:')) currentFile.fnh = parseInt(line.substring(4));
    else if (line.startsWith('LF:')) currentFile.lf = parseInt(line.substring(3));
    else if (line.startsWith('LH:')) currentFile.lh = parseInt(line.substring(3));
    else if (line.startsWith('BRF:')) currentFile.brf = parseInt(line.substring(4));
    else if (line.startsWith('BRH:')) currentFile.brh = parseInt(line.substring(4));
    else if (line === 'end_of_record') {
      files.push(currentFile);
      currentFile = null;
    }
  }
}

const results = files
  .map((f) => {
    const statements = f.lf > 0 ? Math.round((f.lh / f.lf) * 10000) / 100 : 100;
    const branches = f.brf > 0 ? Math.round((f.brh / f.brf) * 10000) / 100 : 100;
    const functions = f.fnf > 0 ? Math.round((f.fnh / f.fnf) * 10000) / 100 : 100;
    const lines = f.lf > 0 ? Math.round((f.lh / f.lf) * 10000) / 100 : 100;
    const score = (statements + branches + functions + lines) / 4;

    return {
      file: f.file.replace(/\\/g, '/'),
      statements,
      branches,
      functions,
      lines,
      score,
    };
  })
  .sort((a, b) => a.score - b.score)
  .slice(0, 10);

const output = results.map((r) => ({
  file: r.file,
  statements: r.statements,
  branches: r.branches,
  functions: r.functions,
  lines: r.lines,
}));

console.log(JSON.stringify(output, null, 2));
