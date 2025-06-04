module.exports = {
  // ... existing config ...
  ignoreWarnings: [
    {
      module: /node_modules\/@antv\/util/,
      message: /Failed to parse source map/,
    },
  ],
}; 