module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@components": "./components",
          "@screens": "./screens",
          "@assets": "./assets",
          "@lib": "./lib",
        },
      },
    ],
  ],
}
