module.exports = {
	extends: [require.resolve('@umijs/fabric/dist/eslint')],
	globals: {
		page: true,
	},
	rules: {
		'import/no-extraneous-dependencies': 0,
		'dot-notation': 0,
		'@typescript-eslint/camelcase': 0,
	},
};
