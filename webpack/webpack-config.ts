//#region Imports

import type * as webpack from 'webpack';
import { MaybeUndefined as Maybe } from 'tsdef';

//#endregion Imports

export declare type Configuration = webpack.Configuration;
export declare interface CliConfigOptions
{
    config?:            string;
    mode?:              Configuration["mode"];
    env?:               string;
    'config-register'?: string;
    configRegister?:    string;
    'config-name'?:     string;
    configName?:        string;
}

export declare type WebpackFactoryEnv<Keys extends string = string, KT = Maybe<string>> =
    // Catch anything that isn't non-literal string types for Keys
    string extends Keys
        ? NodeJS.ProcessEnv
        : Record<Keys, KT> & NodeJS.ProcessEnv;

export declare type ConfigurationFactory<EnvVars extends string = string> = ((
    env:  WebpackFactoryEnv<EnvVars>, // string | Record<string, boolean | number | string> | undefined,
    args: CliConfigOptions,
) => Configuration | Promise<Configuration>);
