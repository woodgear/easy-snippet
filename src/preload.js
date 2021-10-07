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

	code() {
		return this.evalSync("code")
	}

	separator() {
		return this.evalSync("separator")
	}

	getSeparator() {
		return this.separator()
	}

	async list() {
		const ret = await this.eval("list")
		return ret.split(this.getSeparator()).filter(str => str.length != 0)
	}

	async evalSelect(opt) {
		return this.eval(`eval ${opt}`)
	}

	async preview(opt) {
		return this.eval(`description ${opt}`)
	}
}

const UTOOLS_SHELL_ACTIONS_PATH = ["/home/wucong/sm/project/easy-snippet/src/example.utools.sh"]

const OUT = {}
UTOOLS_SHELL_ACTIONS_PATH.forEach((path) => {
	const shell = new UtoolsShellActions(path)
	const code = shell.code()
	const mode = shell.mode()
	OUT[code] = {
		mode,
		args: {
			enter: (action, callbackSetList) => {
				(async () => {
					const list = await shell.list()
					callbackSetList(list.map(ret => { return { title: ret } }))
				})()
			},
			search: (action, searchWord, callbackSetList) => {
				asyncSearch(shell, window.utools, action, searchWord, callbackSetList)
			},
			select: (action, itemData, callbackSetList) => {
				asyncSelect(shell, window.utools, action, itemData, callbackSetList)
			},
			placeholder: "搜索"
		}
	}
})

async function asyncSearch(shell, utools, action, searchWord, callbackSetList) {
	const list = await shell.list()
	callbackSetList(
		list.filter(ret => ret.toLowerCase().includes(searchWord.toLowerCase()))
			.map(win => {
				return { title: win }
			}))
}

async function asyncSelect(shell, utools, action, itemData, callbackSetList) {
	window.utools.outPlugin()
	await shell.evalSelect(itemData.title.trim())
}

window.exports = OUT