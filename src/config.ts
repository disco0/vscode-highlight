/* CONFIGURATION TYPES */

namespace Config
{

    export interface HighlightDecoration extends vscode.DecorationRenderOptions
    {
        [key: string]: any
    }

    export interface HighlightRegexConfiguration
    {
        filterFileRegex?:     string
        filterLanguageRegex?: string
        regexFlags?:          string
        decorations?:         HighlightDecoration[];
    }

    export interface Configuration
    {
        regexes:     Record<string, HighlightRegexConfiguration>;
        decorations: HighlightDecoration;
        maxMatches?: number;
        regexFlags?: ''
    }

    /**
     * Aliased form of settings shape for use with `vscode.workspace.getConfiguration().get(...`
     */
    export type NamespacedConfiguration =
    {
        [Key in keyof Configuration as `highlight.${Key}`]?: Configuration[Key]
    } &  vscode.WorkspaceConfiguration

}

/* IMPORT */

import * as vscode from 'vscode';

/* CONFIG */

namespace Config
{
    export const Namespace = 'highlight';

    export const fallbackConfigurationObject = {} as Configuration;

    export function get(): Config.Configuration
    {

        return vscode.workspace.getConfiguration ().get ( Namespace, fallbackConfigurationObject );

    }

};

/* EXPORT */

export default Config;

export import Configuration               = Config.Configuration;
export import HighlightDecoration         = Config.HighlightDecoration;
export import HighlightRegexConfiguration = Config.HighlightRegexConfiguration;
