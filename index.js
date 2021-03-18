const core = require('@actions/core')
const github = require('@actions/github')

const bullets = line => `* ${line}`

async function main() {
	const {dependencies, devDependencies} = await depcheck('.')
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
