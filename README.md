# react-typescript-webpack-2023

Using Vite Create project as codebase, then setup webpack.

node version: 18.17.1

<br />

## Table of Contents

* [1. Using `Vite` create project](#1)
* [2. Set webpack config](#2)
* [3. Set unit test](#3)
* [4. Set Eslint](#4)
* [5. Set prettier](#5)
* [6. Run lint fix](#6)
* [Fix Vite](#fix-vite)

<br />

## 1. Using `Vite` create project<a id='1'></a>

[commit: 5b7103](https://github.com/roychen3/react-typescript-webpack/commit/5b7103e9ad6bad0e74f44f6520529962a390b2b4)
```sh
√ Project name: react-app
√ Select a framework: » React
√ Select a variant: » TypeScript
```

<br />

## 2. Set webpack config<a id='2'></a>

[commit: a5a1b9](https://github.com/roychen3/react-typescript-webpack/commit/a5a1b9a1e8e59ecdd0279ddadf95be65b7436fe2)

### Set base webpack config

install:
```sh
# base webpack
$ npm install --save-dev webpack webpack-cli

# script env:
$ npm install --save-dev cross-env

# html template
$ npm install --save-dev html-webpack-plugin
```

create `./tools/webpack/webpack.config.cjs`
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = process.cwd();
const devMode = process.env.NODE_ENV === 'development';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: path.resolve(rootPath, 'src/main.tsx'),
  devtool: devMode ? 'inline-source-map' : 'source-map',
  output: devMode
    ? {
        filename: 'main.js',
        path: path.resolve(rootPath, 'dist'),
        clean: true,
      }
    : {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        clean: true,
      },
  optimization: devMode
    ? undefined
    : {
        minimize: true,
        sideEffects: true,
        concatenateModules: true,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 10,
          minSize: 0,
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
            },
          },
        },
      },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      cache: false,
    }),
  ],
};
```

<br />

### Set devServer

install:
```sh
$ npm install --save-dev webpack-dev-server
```

`./tools/webpack/webpack.config.cjs`
```js
...
module.exports = {
...
  devServer: devMode
    ? {
        port: 3000,
        allowedHosts: 'all',
        historyApiFallback: true,
        compress: true,
      }
    : undefined,
...
```

<br />

### Handle css file

install:
```sh
# base css
$ npm install --save-dev style-loader css-loader mini-css-extract-plugin 

# postcss
$ npm install --save-dev postcss postcss-loader postcss-preset-env

# sass
$ npm install --save-dev sass sass-loader
```

`./tools/webpack/webpack.config.cjs`
```js
...
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
...
module.exports = {
...
  plugins: [
    ...
    !devMode && new MiniCssExtractPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        exclude: /\.module\.(sa|sc|c)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.module\.(sa|sc|c)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
}
```

<br />

### Handle typescript/javascript file

install:
```sh
$ npm install --save-dev typescript ts-loader fork-ts-checker-webpack-plugin
```

`./tools/webpack/webpack.config.cjs`
```js
...
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
...
module.exports = {
...
  plugins: [
    ...
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
    ...
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // need this option for typescript config `noEmit`
          },
        },
      },
    ],
  },
}
```

<br />

### Handle image & font file

`./tools/webpack/webpack.config.cjs`
```js
...
  module: {
    rules: [
    ...
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
...
```

<br />

### Handle env file

install:
```sh
$ npm install --save-dev dotenv
```

`./tools/webpack/webpack.config.cjs`
```js
...
const webpack = require('webpack');
const dotenv = require('dotenv');

function getExposeEnv() {
  const result = dotenv.config(); // reade `/.env` file
  let exposeEnv = {
    NODE_ENV: process.env.NODE_ENV,
  };

  if (result.parsed) {
    Object.entries(result.parsed)
      .filter(([key]) => /^APP_ENV_/.test(key))
      .forEach(([key, value]) => {
        exposeEnv[key] = value;
      });
  }
  return exposeEnv;
}
...
module.exports = {
...
  plugins: [
    ...
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(getExposeEnv()),
    }),
  ].filter(Boolean),
...
```

`./.gitignore`
```diff
...
+ env
...
```

<br />

### Set alias

`./tools/webpack/webpack.config.cjs`
```js
module.exports = {
...
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(rootPath),
    },
  },
...
}
```

<br />

### Set `tsconfig.json`:
```diff
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
+   "sourceMap": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
+   "allowSyntheticDefaultImports": true,
+   "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true

+   /* alias */
+   "baseUrl": ".",
+   "paths": {
+     "@/*": ["./*"]
+   },
  },
- "include": ["src"],
+ "include": ["src/**/*", "tools/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

<br />

### Set `package.json`:
```diff
...
	"scripts": {
+   "dev": "cross-env NODE_ENV=development webpack serve --config tools/webpack/webpack.config.cjs",
+   "build": "cross-env NODE_ENV=production webpack --config tools/webpack/webpack.config.cjs",
-   "dev": "vite",
-   "build": "tsc && vite build",
+   "dev:vite": "vite",
+   "build:vite": "tsc && vite build",
		...
	},
...
```

### Done
```
$ npm install
$ npm run dev
```

<br />

### Just using babel

install:
```sh
# babel:
$ npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader
```

`./tools/webpack/webpack.config.cjs`
```diff
...
  module: {
    rules: [
    ...
-     {
-       test: /\.(t|j)sx?$/,
-       exclude: /node_modules/,
-       use: {
-         loader: 'ts-loader',
-         options: {
-           transpileOnly: true, // need this option for typescript config `noEmit`
-         },
-       },
-     },
+     {
+        test: /\.(t|j)sx?$/,
+        exclude: /(node_modules|bower_components)/,
+        use: {
+        loader: 'babel-loader',
+        options: {
+           presets: [
+              '@babel/preset-env',
+              ['@babel/preset-react', { runtime: 'automatic' }],
+              '@babel/preset-typescript',
+           ],
+        },
+        },
+     },
    ],
  },
...
```

<br />

## 3. Set unit test<a id='3'></a>

[commit: 6928fd](https://github.com/roychen3/react-typescript-webpack/commit/6928fd464c2b90d39cd8135b5238317969f3e515)

### Install:

```sh
# jest & swc:
$ npm install --save-dev @jest/globals @types/jest identity-obj-proxy jest jest-environment-jsdom @swc/core @swc/jest

# react testing library:
$ npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event
```

### Set jest

create `./tools/jest/jest.config.cjs`:
```js
const rootPath = process.cwd()

module.exports = {
  rootDir: rootPath,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tools/jest/__mocks__/fileMock.js',
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // mocking CSS modules
    // alias
    '^@/(.*)$': '<rootDir>/$1'
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tools/jest/jest.setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        }
      }
    ]
  }
}
```

<br />

create `./tools/jest/jest.setup.ts`:
```js
import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})
```

set `./.gitignore`
```diff
...
+ coverage
...
```

### Write testing
create `./src/App.test.tsx`
```jsx
import { render, screen, fireEvent } from '@testing-library/react'

import App from '@/src/App'

it('should render the Vite and React logos', () => {
  render(<App />)
  const viteLogo = screen.getByAltText('Vite logo')
  const reactLogo = screen.getByAltText('React logo')
  expect(viteLogo).toBeInTheDocument()
  expect(reactLogo).toBeInTheDocument()
})

it('should render the title "Vite + React"', () => {
  render(<App />)
  const title = screen.getByText('Vite + React')
  expect(title).toBeInTheDocument()
})

it('should render a card with a button that increments the counter when clicked', () => {
  render(<App />)
  const button = screen.getByRole('button', { name: /count is \d+/i })
  fireEvent.click(button)
  expect(button).toHaveTextContent(/count is \d+/i)
})
```

### Set `package.json` & Run test
```diff
...
  "scripts": {
    ...
+  "test": "jest --config=tools/jest/jest.config.cjs"
  },
...
```

```
$ npm run test
```

<br />

## 4. Set Eslint<a id='4'></a>

[commit: a97f27](https://github.com/roychen3/react-typescript-webpack/commit/a97f276c4f3fba374c733ae2385390607acb5c8a)

`./.eslintrc.cjs`
```diff
module.exports = {
  ...
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
+   indent: ['error', 2],
+   quotes: ['error', 'single'],
+   semi: ['error', 'always'],
+   'jsx-quotes': ['error', 'prefer-double'],
+ },
+ overrides: [
+   {
+     files: ['tools/**/*.{js,ts,cjs,mjs}', '*.{js,ts,cjs,mjs}'],
+     env: { node: true },
+     rules: {
+       '@typescript-eslint/no-var-requires': 'off',
+     },
+   },
+   {
+     files: ['**/*.{spec,test}.{j,t}s?(x)'],
+     env: { node: true, jest: true },
+   },
+ ],
};
```

set `./package.json`
```diff
...
  "scripts": {
    ...
-   "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
+   "lint": "eslint . --ext ts,tsx,js,jsx,cjs,mjs --report-unused-disable-directives --max-warnings 0",
+   "lint:fix": "npm run lint -- --fix",
    "test": "jest --config=tools/jest/jest.config.cjs"
  },
...
```

## 5. Set prettier<a id='5'></a>

[commit: cacd1e](https://github.com/roychen3/react-typescript-webpack/commit/cacd1e246af7ebcb2d33cb5fc5c27721fbcc52e2)

install:
```sh
$ npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

set `./.eslintrc.cjs`
```diff
module.exports = {
  ...
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
+   'plugin:prettier/recommended' // Make sure to put `prettier` last
  ],
  ...
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
-   indent: ['error', 2],
-   quotes: ['error', 'single'],
-   semi: ['error', 'always'],
-   'jsx-quotes': ['error', 'prefer-double'],
+   "prettier/prettier": "error"
  },
  ...
};
```

create `./prettier.config.cjs`
```js
module.exports = {
  tabWidth: 2,
  bracketSameLine: true,
  jsxSingleQuote: false,
  semi: true,
  singleQuote: true,
}
```

set `./package.json`
```diff
...
  "scripts": {
    ...
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "npm run lint -- --fix",
+   "format": "prettier --cache --write \"**/*.+(ts|tsx|js|jsx|cjs|mjs|json|css|scss|sass)\"",
    "test": "jest --config=tools/jest/jest.config.cjs"
  },
...
```

<br />

## 6. Run eslint fix & format<a id='6'></a>

[commit: 8756e4](https://github.com/roychen3/react-typescript-webpack/commit/8756e4f9b2348bfbd806254605dfaf72e63daead)

```sh
$ npm run lint:fix
$ npm run format
```

<br />

## Fix Vite<a id='fix-vite'></a>

[commit: 576aea](https://github.com/roychen3/react-typescript-webpack/commit/576aea895be885856fd6c2276a667e3449069963)

move `./vite.config.ts` to `./tools/vite/vite.config.ts` and Set: 
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

const rootPath = process.cwd();

function getExposeEnv() {
  const result = dotenv.config(); // reade `/.env` file
  let exposeEnv: { [key: string]: string } = {};

  if (result.parsed) {
    Object.entries(result.parsed)
      .filter(([key]) => /^APP_ENV_/.test(key))
      .forEach(([key, value]) => {
        exposeEnv[key] = value;
      });
  }
  return exposeEnv;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': rootPath,
      },
    },
    server: {
      host: '0.0.0.0',
    },
    define: {
      'process.env': {
        NODE_ENV: mode,
        ...getExposeEnv(),
      },
    },
  };
});
```

set `package.json`
```diff
  "scripts": {
    ...
-   "dev:vite": "vite",
-   "build:vite": "tsc && vite build",
-   "preview": "vite preview",
+   "dev:vite": "vite --config tools/vite/vite.config.ts",
+   "build:vite": "tsc && vite --config tools/vite/vite.config.ts build",
+   "preview": "vite  --config tools/vite/vite.config.ts preview",
    ...
  },
```

set `tsconfig.json`
```diff
{
  "compilerOptions": {
    ...
  },
- "include": ["vite.config.ts"]
+ "include": ["tools/vite/vite.config.ts"]
}
```

### Done
```
$ npm install
$ npm run dev:vite
```