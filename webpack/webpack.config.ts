/// <reference types="webpack" />

// The things I do for types
import process = require('process');
delete process.env.TS_NODE_PROJECT;

/* IMPORT */

import { resolve } from 'path'

import type { MaybeUndefined as Maybe } from 'tsdef'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import {
  CliConfigOptions,
  ConfigurationFactory,
  WebpackFactoryEnv
} from './webpack-config'

/* CONTEXT */

const projectBase = resolve(__dirname, '../')

/* PLUGINS */

// Not needed (for now)
// const tsloaderPaths = new TsConfigPathsPlugin({
//   configFile: resolve(projectBase, 'src/tsconfig.json')
// })

/* CONFIG / EXPORT */

const config: ConfigurationFactory = ((env, config) =>
{
  const outDir        = '../dist',
        outPath       = resolve(projectBase, 'dist'),
        srcPath       = resolve(projectBase, 'src'),
        context       = srcPath,
        entryFile     = './extension.ts',
        entry         = entryFile,
        entryAbsolute = resolve(context, 'extension.ts'),
        tsConfigPath  = resolve(context, 'tsconfig.json'),
        forkChecker   = true

  return {
    context,
    target: 'node',
    entry,

    output: {
      path: resolve(context, outDir),
      filename: 'extension.js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    optimization: {
        minimize: (config?.mode ?? 'development') === 'production',

    },
    externals:
    {
        // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        vscode: 'commonjs vscode'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      // Not needed (for now)
      // plugins: [ tsloaderPaths ]
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
      ... forkChecker
        ? [new ForkTsCheckerWebpackPlugin({ typescript: { configFile: tsConfigPath }, formatter: 'basic', })]
        : [ ],
      new CleanWebpackPlugin({ verbose: true })
    ],

    infrastructureLogging:
    {
      level: 'verbose',

    },
    stats:
    {
      logging: 'verbose',
      all: true
    }
  }
})

export default config;
