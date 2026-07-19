import js from "@eslint/js"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"
import globals from "globals"

export default defineConfig([
	js.configs.recommended,
	react.configs.flat.recommended,
	react.configs.flat["jsx-runtime"],

	{
		files: ["**/*.{js,jsx}"],

		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: globals.browser,
		},

		plugins: {
			react,
			"react-hooks": reactHooks,
		},

		settings: {
			react: {
				version: "detect",
			},
		},

		rules: {
			"react/display-name": "off",
			"no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"react/prop-types": "off",

			...reactHooks.configs.recommended.rules,
		},
	},
])
