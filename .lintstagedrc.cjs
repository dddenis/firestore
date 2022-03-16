const { ESLint } = require('eslint');

module.exports = {
  '*.{js,cjs,mjs,ts,tsx}': async (files) => lintFiles(await removeIgnoredFiles(files)),
  '*.{js,cjs,mjs,json,md,ts,tsx,yaml,yml}': formatFiles,
};

const eslint = new ESLint();

async function removeIgnoredFiles(files) {
  const filteredFiles = await Promise.all(
    files.map(async (file) => ((await eslint.isPathIgnored(file)) ? null : file)),
  );

  return filteredFiles.filter(Boolean);
}

function lintFiles(files) {
  return `pnpm lint:base --fix ${files.join(' ')}`;
}

function formatFiles(files) {
  return `pnpm format:base ${files.join(' ')}`;
}
