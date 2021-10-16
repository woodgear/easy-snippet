const assert = require('assert');
const { UtoolsShellActions, parseList } = require('../src/shell')

describe('shell ', function () {
	it('list should ok', async function () {
		const s = new UtoolsShellActions("./src/example.utools.sh")
		const list = await s.list()
		console.log(list)
	});
	it('test parseList', function () {
		const list = parseList(`
		---ctx
		1.c xxxxafafd
		---title
		1.t adfasdf
		---description
		1.d asdfadfasdfsadfsaf
		---ctx
		2.c xxxxafafd
		---title
		2.t adfasdf
		---description
		2.d asdfadfasdfsadfsaf
		sadfaf
		asdfad
		as
		`)
		console.log(list)
		assert.strictEqual(list.length, 2)
	});

});
