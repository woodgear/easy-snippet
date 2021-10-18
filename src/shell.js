const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

async function cmd(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				reject(error)
			}
			resolve(stdout ? stdout.trim() : stderr);
		});
	});
}

function cmdSync(cmd) {
	const stdout = execSync(cmd)
	return stdout.toString().trim();
}


class UtoolsShellActions {
	constructor(path) {
		this.path = path
	}

	async eval(opt) {
		return cmd(`bash -c 'source ${this.path} && ${opt}'`)
	}

	evalSync(opt) {
		return cmdSync(`bash -c 'source ${this.path} && ${opt}'`)
	}

	mode() {
		return this.evalSync("mode")
	}

	feature() {
		return JSON.parse(this.evalSync("feature"))
	}

	getSeparator() {
		return this.separator()
	}

	async list() {
		const ret = await this.eval("list")
		return parseList(ret)
	}

	async evalSelect(opt) {
		return this.eval(`run "${opt}"`)
	}
}

function parseList(list) {
	return list.split("---ctx")
		.map(s => s.trim())
		.filter(str => str.length != 0)
		.map((str) => {
			const [ctx, left] = str.split("---title")
			const [title, description] = left.split("---description")
			return { ctx: ctx.trim(), title: title.trim(), description: description.trim() }
		})
		.filter(o => !!o)
}
module.exports = { UtoolsShellActions, parseList }