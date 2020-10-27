/// <reference types="webpack" />

// The things I do for types
delete process.env.TS_NODE_PROJECT

/* IMPORT */

import { resolve } from 'path'

import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import type * as webpack from 'webpack';
type Configuration = webpack.Configuration;
type CliConfigOptions = import('webpack/index').CliConfigOptions;

export type ConfigurationFactory = ((
    env: NodeJS.Process['env'], // string | Record<string, boolean | number | string> | undefined,
    args: CliConfigOptions,
) => Configuration | Promise<Configuration>);

/* PLUGINS */

const tsloaderPaths = new TsConfigPathsPlugin({
  configFile: resolve(__dirname, 'src/tsconfig.json')
})

/* CONFIG / EXPORT */

const config: ConfigurationFactory = ((env, config) => {
  const outDir = resolve( __dirname, 'dist' )
  const entry = resolve( __dirname, 'src/extension.ts' )
  const tsConfigPath = resolve(__dirname, 'src/tsconfig.json')
  const forkChecker = true

  return {
    context: resolve(__dirname),
    target: 'node',
    entry,
    output: {
      path: outDir,
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externals: {
        // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        vscode: 'commonjs vscode'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [ tsloaderPaths ]
    },
    module: {
      rules: [{
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [ {
              loader: 'ts-loader' ,
              options: { transpileOnly: forkChecker }
          } ],
      }]
    },
    plugins: [
      ... forkChecker ? [new ForkTsCheckerWebpackPlugin({
          typescript: { configFile: tsConfigPath }
      })] : []
    ]
  } as webpack.Configuration
})

export default config;
