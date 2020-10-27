export interface HighlightDecoration extends vscode.DecorationRenderOptions
{
    [key: string]: any
}

export interface HighlightRegexConfiguration
{
    filterFileRegex?: string
    filterLanguageRegex?: string
    regexFlags?: string
    decorations?: HighlightDecoration[];
}

export interface Configuration
{
    regexes: Record<string, HighlightRegexConfiguration>;
    decorations: HighlightDecoration;
    maxMatches?: number;
    regexFlags?: ''
}

/* IMPORT */

import * as vscode from 'vscode';

/* CONFIG */

const Config = {

  get ( extension = 'highlight' ) {

    return vscode.workspace.getConfiguration ().get<Configuration> ( extension );

  }

};

/* EXPORT */

export default Config;
