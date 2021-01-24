/* IMPORT */

import * as vscode from 'vscode';
import { NonNilProps } from 'tsdef'

/* CONFIGURATION TYPES */

namespace Config
{
    export interface HighlightDecoration extends vscode.DecorationRenderOptions
    {
    }

    /**
     * User defined decoration configuration
     */
    export interface HighlightRegexConfiguration
    {
        filterFileRegex?:     string;
        filterLanguageRegex?: string;
        regexFlags?:          string;
        decorations?:         HighlightDecoration[];

        configPath?:          string;

        enabled?:            boolean;
    }

    /**
     * Loaded user configuration
     */
    export interface Configuration
    {
        /**
         * Object mapping regexes to an array of decorations to apply to the capturing groups
         */
        regexes: Record<string, HighlightRegexConfiguration>;

        /**
         * Default decorations from which all others inherit from
         */
        decorations: HighlightDecoration;

        /**
         * Maximum number of matches to decorate per regex, in order not to crash the app with accidental cathastropic regexes
         */
        maxMatches?: number;

        /**
         * Flags used when building regexes
         */
        regexFlags?: string;

        /**
         * Path to external extension configuration file
         */
        configPath?: string
    }

    /**
     * Aliased form of settings shape for use with `vscode.workspace.getConfiguration().get()`
     *
     * (Thought I needed it, keeping it need returns) (test)
     */
    export type NamespacedConfiguration =
    {
        [Key in keyof Configuration as `highlight.${Key}`]?: Configuration[Key]
    } &  vscode.WorkspaceConfiguration

}

/* CONFIG */

namespace Config
{
    export const Namespace = 'highlight';

    export const fallbackConfigurationObject: Configuration =
    {
        decorations: { },
        regexes:     { }
    };

    /**
     * @TODO(disk0): Handle partial configuration objects for first level of properties,
     *               e.g. no `regexes` property, insert empty default (for type checker)
     */
    export function get(): Config.Configuration
    {
        // Test if below is breaking debug build
        return vscode.workspace.getConfiguration ().get<Config.Configuration>( Namespace, fallbackConfigurationObject );

        return {
          ...fallbackConfigurationObject,
          ...vscode.workspace.getConfiguration ().get ( Namespace, fallbackConfigurationObject )
        } as Config.Configuration
    }

};

/* EXPORT */

export default Config;

export import Configuration               = Config.Configuration;
export import HighlightDecoration         = Config.HighlightDecoration;
export import HighlightRegexConfiguration = Config.HighlightRegexConfiguration;
