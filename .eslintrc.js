module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['babel-preset-expo'],
    },
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['react'],
  extends: ['plugin:react/recommended'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // Enforce using ThemedText instead of react-native Text
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-native',
            importNames: ['Text'],
            message: 'Use ThemedText from src/components/ThemedText instead of react-native Text.',
          },
        ],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXOpeningElement > JSXIdentifier[name="Text"]',
        message: 'Use <ThemedText> instead of <Text>.',
      },
    ],
    // Optional: ensure components are defined with display names
    'react/display-name': 'off',
    'react/prop-types': 'off',
  },
};