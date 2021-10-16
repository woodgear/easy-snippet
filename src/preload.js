const { UtoolsShellActions } = require("./shell")
const fs = require("fs")
const homedir = require('os').homedir();

function getConfig() {
	const configJsonStr = fs.readFileSync(`${homedir}/.easy-card.rc`)
	const config = JSON.parse(configJsonStr)
	return config
}

const config = getConfig()

const UTOOLS_SHELL_ACTIONS_PATH = config.actionsPath

const OUT = {}
UTOOLS_SHELL_ACTIONS_PATH.forEach((path) => {
	const shell = new UtoolsShellActions(path)

	const feature = shell.feature()
	const mode = shell.mode()
	console.log(feature)
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
	window.utools.outPlugin()
	await shell.evalSelect(itemData.ctx.trim())
}

window.exports = OUT