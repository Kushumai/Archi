import next from "@eslint/next";

export default [
  ...next(),
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];