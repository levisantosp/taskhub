import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        }
    },
    {
        rules: {
            indent: ['error', 4, {
                ignoredNodes: ['CallExpression > MemberExpression'],
                SwitchCase: 1
            }],
            quotes: ['error', 'single'],
            'keyword-spacing': ['error', {
                before: true,
                after: true,
                overrides: {
                    if: { after: false },
                    for: { after: false },
                    while: { after: false },
                    switch: { after: false },
                    catch: { after: false }
                }
            }],
            'space-before-function-paren': ['error', {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'never'
            }],
            '@typescript-eslint/no-explicit-any': 'off',
            'no-empty': 'off',
            'import/no-anonymous-default-export': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-empty-object-type': 'off'
        }
    }
])
