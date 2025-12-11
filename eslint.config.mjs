import { config } from '@n8n/node-cli/eslint';

export default [
	...config,
	{
		files: ['nodes/Propstack/PropstackTrigger.node.ts'],
		rules: {
			'@n8n/community-nodes/node-usable-as-tool': 'off',
		},
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			'@n8n/community-nodes/no-restricted-imports': 'off',
			'@n8n/community-nodes/no-restricted-globals': 'off',
			'import-x/no-unresolved': 'off',
		},
	},
];
