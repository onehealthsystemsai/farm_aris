export default {
  // Basic formatting options
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  
  // JSX-specific options for better formatting
  bracketSameLine: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  arrowParens: 'always',
  
  // File-specific overrides for JSX optimization
  overrides: [
    {
      files: ['*.tsx', '*.jsx'],
      options: {
        // Keep JSX attributes properly aligned
        bracketSameLine: false,
        // Ensure consistent JSX quote usage
        jsxSingleQuote: false,
        // Proper JSX bracket spacing
        bracketSpacing: true,
        // Print width optimized for JSX readability
        printWidth: 100,
      },
    },
    {
      files: ['*.json', '*.md', '*.yaml', '*.yml'],
      options: {
        tabWidth: 2,
        printWidth: 80,
      },
    },
  ],
  
  // Parser settings
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  requirePragma: false,
  proseWrap: 'preserve',
  vueIndentScriptAndStyle: false,
};