// 匹配全局路径，如果是全局的 css，则不进行 css 模块化

let { getOptions } = require('loader-utils');

module.exports = function(content) {
	let path = this.resourcePath;
	let { globalCssPath } = getOptions(this);

	let isIncludes = globalCssPath.some(_path => {
		return path.includes(_path);
	});

	if (isIncludes) {
		console.log(`[global-css-module-loader] ${path} is global`);
		content = `:global{${content}}`;
	}

	return content;
};
