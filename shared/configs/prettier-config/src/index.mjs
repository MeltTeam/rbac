export default {
  overrides: [
    {
      files: ['*.json5'],
      options: {
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
  ],
  semi: false,
  singleQuote: true,
  printWidth: 150,
  plugins: [],
}
