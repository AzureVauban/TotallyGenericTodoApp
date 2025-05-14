module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*))",
  ],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        outputPath: "test-report.html",
        pageTitle: "Test Report",
      },
    ],
  ],
};
