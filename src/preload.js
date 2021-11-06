const { UtoolsShellActions } = require("./shell")
const fs = require("fs")
const homedir = require('os').homedir();

function log(msg) {
	fs.appendFileSync("/home/cong/.easy-card.log", JSON.stringify(msg) + "\n", { encoding: 'utf8', })
}
function getConfig() {
	const configJsonStr = fs.readFileSync(`${homedir}/.easy-card.rc`)
	const config = JSON.parse(configJsonStr)
	return config
}

const config = getConfig()
log(`ap is ${config.actionsPath}`)
const UTOOLS_SHELL_ACTIONS_PATH = config.actionsPath

const OUT = {}
UTOOLS_SHELL_ACTIONS_PATH.forEach((path) => {

	const shell = new UtoolsShellActions(path)

	const feature = shell.feature()
	const mode = shell.mode()
	log(`feature is ${JSON.stringify(feature)} mode is ${mode}`)
	OUT[feature.code] = {
		mode,
		args: {
			enter: (action, callbackSetList) => {
				(async () => {
					const list = await shell.list()
					console.log(list)
					callbackSetList(list)
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
		list.filter(item => item.title.toLowerCase().includes(searchWord.toLowerCase()))
			.map(item => {
				return item
			}))
}

async function asyncSelect(shell, utools, action, itemData, callbackSetList) {
	utools.outPlugin()
	utools.hideMainWindow()
	await shell.evalSelect(itemData.ctx.trim())
}

window.exports = OUT