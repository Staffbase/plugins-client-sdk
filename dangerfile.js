import * as fs from 'fs';
import * as path from 'path';

import { danger, fail, markdown, schedule, warn } from 'danger';
import { compact, includes, uniq } from 'lodash';
import { istanbulCoverage } from 'danger-plugin-istanbul-coverage';

// Setup
const modified = danger.git.modified_files;
const body = (danger.github.pr.body && danger.github.pr.body.toLowerCase()) || '';
const title = (danger.github.pr.title && danger.github.pr.title.toLowerCase()) || '';

const bodyAndTitle = body + title;

// Custom modifiers for people submitting PRs to be able to say "skip this"
const trivialPR = bodyAndTitle.includes('#trivial');
const acceptedNoTests = bodyAndTitle.includes('#skip_new_tests');

// Warns if a test plan is missing.
const includesTestPlan = body.includes('test plan');
const isWIP = includes(title, '[wip]');

const filesOnly = file => fs.existsSync(file) && fs.lstatSync(file).isFile();

// Modified or Created can be treated the same a lot of the time
const touchedFiles = modified.concat(danger.git.created_files).filter(p => filesOnly(p));

// Custom subsets of known files
const modifiedAppFiles = modified.filter(p => includes(p, 'lib/')).filter(p => filesOnly(p));

const touchedAppOnlyFiles = touchedFiles.filter(p => includes(p, 'src/lib/'));

// No PR is too small to include a description of why you made a change
if (!body || body.length < 10) {
  const title = ':grey_question: No description.';
  const idea = 'This pull request needs a meaningful description.';
  fail(`${title} - <i>${idea}</i>`);
}

// When there are app-changes and it's not a PR marked as trivial, expect
// there to be CHANGELOG changes.
// const changelogChanges = includes(modified, 'CHANGELOG.md');
// if (modifiedAppFiles.length > 0 && !trivialPR && !changelogChanges) {
//   const title = ':bulb: No CHANGELOG added.';
//   const idea =
//     "This PR needs a description of the changes which are made. If your changes don't need a log, include #trivial to the description";
//   fail(`${title} - <i>${idea}</i>`);
// }

// Warns if the PR title contains [WIP]
if (isWIP) {
  const title = ':construction_worker: Work In Progress';
  const idea = 'This PR appears to be a work in progress, and may not be ready to be merged yet.';
  warn(`${title} - <i>${idea}</i>`);
}

// Warns if there are changes to package.json, and tags the team.
const packageChanged = includes(danger.git.modified_files, 'package.json');
if (packageChanged) {
  const title = ':lock: package.json';
  const idea =
    'Changes were made to package.json. ' + 'This will require a check by a Staffbase employee';
  warn(`${title} - <i>${idea}</i>`);
}

if (!includesTestPlan) {
  const title = ':clipboard: Test Plan';
  const idea = 'This PR appears to be missing a Test Plan.';
  warn(`${title} - <i>${idea}</i>`);
}

// Always ensure we assign someone to review
if (danger.github.pr.assignee === null) {
  const title = ':mag: No reviewers!';
  const idea =
    'Please assign someone to merge this PR, and optionally include people who should review.';
  fail(`${title} - <i>${idea}</i>`);
}

// Tags big PRs
let bigPRThreshold = 600;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  const title = ':exclamation: Big PR';
  const idea = `This PR is difficult to review because it touches ${danger.github.pr.additions +
    danger.github.pr.deletions} lines.`;
  warn(`${title} - <i>${idea}</i>`);
}

// Check that every file touched has a corresponding test file
const correspondingTestsForAppFiles = touchedAppOnlyFiles.map(f => {
  const newPath = path.dirname(f);
  const name = path.basename(f).replace('.js', '-test.js');
  return `/test/${newPath}/${name}`;
});

// New app files should get new test files
// Allow warning instead of failing if you add "#skip_new_tests" inside the body, make it explicit.
const testFilesThatDontExist = correspondingTestsForAppFiles.filter(f => fs.existsSync(f));

if (testFilesThatDontExist.length > 0) {
  const callout = acceptedNoTests ? warn : fail;

  const title = ':exclamation: Missing Test Files';
  const idea = `${testFilesThatDontExist.map(f => `  - [] \`${f}\``).join('\n')} 
  If these files are supposed to not exist, please update your PR body to include "#skip_new_tests".`;
  callout(`${title} - <i>${idea}</i>`);
}

schedule(
  istanbulCoverage({
    // The location of the istanbul coverage file.
    coveragePath: { path: './coverage/lcov.info', type: 'lcov' /* ||  "json-summary" */ },
    reportFileSet: 'createdOrModified',
    threshold: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  })
); // Use default configuration
