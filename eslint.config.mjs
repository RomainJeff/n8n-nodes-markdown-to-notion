import { config } from '@n8n/node-cli/eslint';

// Disable the no-restricted-imports rule since we bundle dependencies with esbuild
export default config.map((conf) => {
	if (conf.rules && conf.rules['@n8n/community-nodes/no-restricted-imports']) {
		return {
			...conf,
			rules: {
				...conf.rules,
				'@n8n/community-nodes/no-restricted-imports': 'off',
			},
		};
	}
	return conf;
});
