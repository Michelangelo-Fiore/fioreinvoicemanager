import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";

// STATIC IMPORTS for plugins to avoid `require()` violations
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// supply baseline recommendedConfig to FlatCompat for ESLint 9+
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

/** @type {import("eslint").Linter.FlatConfig[]} */
const eslintConfig = [
	// ignore build and deps (Next.js 15 / ESLint 9+ style)
	{
		ignores: [
			"**/.next/**",
			"**/node_modules/**",
			"public/sw.js",
			"service-worker.js",
			"eslint.config.mjs",
			".next/**",
			"out/**",
			".firebase/**",
			"node_modules/**",
		],
	},
	{
		plugins: { "@next/next": nextPlugin },
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
		},
	},
	...compat.extends(
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:import/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
		"prettier",
	),
	{
		plugins: {
			"@typescript-eslint": tsPlugin,
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
			import: importPlugin,
			prettier: prettierPlugin,
		},
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parser: tsParser,
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		settings: {
			react: {
				version: "detect",
			},
			"import/resolver": {
				node: {
					extensions: [".js", ".jsx", ".ts", ".tsx"],
					moduleDirectory: ["node_modules", "src/"],
				},
				typescript: {
					project: "./tsconfig.json",
				},
			},
		},
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
			"@typescript-eslint/consistent-type-definitions": "warn",
			"@typescript-eslint/ban-ts-comment": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-unused-expressions": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
			"import/prefer-default-export": "off",
			"react-hooks/exhaustive-deps": "warn",
			"react/react-in-jsx-scope": "off",
			"react/no-unescaped-entities": "warn",
			"react/prop-types": "off",
			"react/jsx-key": "warn",
			"prefer-regex-literals": "off",
			"prefer-const": "warn",
			"no-cond-assign": "off",
			"no-continue": "warn",
			"no-restricted-syntax": "warn",
			"no-restricted-globals": "warn",
			"no-new": "warn",
			"import/order": "warn",
			"no-alert": "warn",
			"no-lone-blocks": "warn",
			"default-case": "warn",
			"no-plusplus": "warn",
			"no-shadow": "warn",
			"no-empty": "warn",
			"no-unused-vars": "warn",
			"no-unused-expressions": "warn",
			"no-underscore-dangle": "warn",
			"no-nested-ternary": "off",
			"no-param-reassign": "warn",
			"consistent-return": "off",
			"import/no-cycle": "warn",
			"no-else-return": "off",
			"no-console": "warn",
			camelcase: "warn",
			quotes: ["warn", "double"],
			semi: ["warn", "always"],
			"prettier/prettier": ["warn", { endOfLine: "auto" }],
			"import/extensions": [
				"warn",
				"ignorePackages",
				{
					js: "never",
					jsx: "never",
					ts: "never",
					tsx: "never",
				},
			],
			"import/no-extraneous-dependencies": [
				"warn",
				{
					devDependencies: ["history"],
					peerDependencies: true,
				},
			],
		},
	},
];

export default eslintConfig;
