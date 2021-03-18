const core = require('@actions/core')
const github = require('@actions/github')
const depcheck = require('depcheck')

const bullets = line => `* ${line}`

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  skipMissing: false, // skip calculation of missing dependencies
  ignorePatterns: [
    // files matching these patterns will be ignored
    'sandbox',
    'dist',
    'bower_components',
  ],
  ignoreMatches: [
    // ignore dependencies that matches these globs
    'grunt-*',
  ],
  parsers: {
    // the target parsers
    '**/*.js': depcheck.parser.es6,
    '**/*.jsx': depcheck.parser.jsx,
  },
  detectors: [
    // the target detectors
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration,
  ],
  specials: [
    // the target special parsers
    depcheck.special.eslint,
    depcheck.special.webpack,
  ],
  package: {
    // may specify dependencies instead of parsing package.json
    dependencies: {
      lodash: '^4.17.15',
    },
    devDependencies: {
      eslint: '^6.6.0',
    },
    peerDependencies: {},
    optionalDependencies: {},
  },
}

async function main() {
	const {dependencies, devDependencies} = await depcheck('.', options)
	const token = core.getInput('GITHUB_TOKEN')
	const {context} = github
	if (!context.payload.pull_request) {
        core.setFailed('No pull request found')
        return
    }

	const prNum = context.payload.pull_request.number

	const depsMissing = dependencies.map(bullets).join('\n')
	const devDepsMissing = devDependencies.map(bullets).join('\n')

	const body = `Dependencies: \n${depsMissing}\n\nDev Deps: \n${devDepsMissing}`

	const kit = new github.Github(token)
	await kit.issues.createComment({
		...context.repo,
		issue_number: prNum,
		body,
	})
}


main().catch(err => core.setFailed(err.message))
