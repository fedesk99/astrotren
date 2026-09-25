// craco.config.js
const path = require("path");
require("dotenv").config();

const webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },

    configure: (webpackConfig) => {
      const findCssLoader = (rules) => {
        for (const rule of rules) {
          if (rule.oneOf) {
            const found = findCssLoader(rule.oneOf);
            if (found) return found;
          }

          if (rule.use) {
            const uses = Array.isArray(rule.use)
              ? rule.use
              : [rule.use];

            const cssLoader = uses.find(
              (use) =>
                typeof use === "object" &&
                use.loader &&
                use.loader.includes("css-loader")
            );

            if (cssLoader) return cssLoader;
          }
        }

        return null;
      };

      const cssLoader = findCssLoader(webpackConfig.module.rules);

      if (cssLoader) {
        cssLoader.options = {
          ...cssLoader.options,
          url: {
            filter: (url) => !url.startsWith("/fonts/"),
          },
        };
      }

      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      return webpackConfig;
    },
  },
};

module.exports = webpackConfig;