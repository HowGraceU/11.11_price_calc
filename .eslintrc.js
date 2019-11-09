module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'airbnb',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	plugins: [
		'react',
		'@typescript-eslint',
	],
	settings: {
		'import/resolver': {
			webpack: {
				config: './webpack.config.js',
			},
		},
	},
	rules: {
		"react/jsx-filename-extension": [1, {
			"extensions": [".tsx", ".jsx", ".d.ts", ".ts"]
		}],
		"react/static-property-placement": [0],
		"max-len": [0],
		"react/jsx-props-no-spreading": [2, {
			"exceptions": ["Component"]
		}],
		'linebreak-style': [1, "windows"],
		'react/forbid-prop-types': [1, {
			"forbid": ['any'],
		}],
		'no-mixed-operators': [0]
	},
};
