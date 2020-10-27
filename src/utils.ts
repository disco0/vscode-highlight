/* IMPORT */

import * as vscode from 'vscode';

/* GUARDS */

// Get toString as close to source as possible
const primativeToString: typeof Object.prototype.toString =
((protoProps: readonly ['__proto__', 'prototype']) => {
    for(const propName of protoProps)
       // @ts-expect-error
        if(propName in ({}) && ({})[propName].toString === 'function')
            // @ts-expect-error
            return ({})[propName].toString;
})(['__proto__', 'prototype'] as const);

export function isFunction<F extends (...args: any[]) => any>(obj: unknown): obj is F
{
    return primativeToString.call(obj) === "[object Function]"
}
export function isString(obj: unknown): obj is string
{
    return primativeToString.call(obj) === "[object String]"
}
export function isNumber(obj: unknown): obj is Number
{
    return primativeToString.call(obj) === "[object Number]"
}
export function isRegExp(obj: unknown): obj is RegExp
{
    return primativeToString.call(obj) === "[object RegExp]"
}

// Refactored from `Util.document.editor.is`
export function isTextEditor ( x: unknown ): x is NonNullTextEditor
{
    return !!x && typeof x === 'object' && 'document' in x!;
}

export const is =
{
    function: isFunction,
    string:   isString,
    number:   isNumber,
    regex:    isRegExp
}

/* DECLARTIONS */

import type { Configuration, HighlightDecoration, HighlightRegexConfiguration } from './config'

type NonNull<T> = Exclude<T, null>;

type NonNullTextEditor = NonNull<vscode.TextEditor>

/* UTILS */

const Utils = {

  document: {

    isFiltered ( doc: vscode.TextDocument, options: HighlightRegexConfiguration ) {

      if ( options.filterLanguageRegex ) {

        const language = doc.languageId;

        if ( !language ) return false;

        const re = new RegExp ( options.filterLanguageRegex, 'i' );

        if ( !re.test ( language ) ) return false;

      }

      if ( options.filterFileRegex ) {

        const filePath = doc.uri.fsPath;

        if ( !filePath ) return false;

        const re = new RegExp ( options.filterFileRegex, 'i' );

        if ( !re.test ( filePath ) ) return false;

      }

      return true;

    },

    getEditors ( doc: vscode.TextDocument ) {

      return vscode.window.visibleTextEditors.filter ( textEditor => textEditor.document === doc );

    }

  },

  editor: {

    is: isTextEditor

  }

};

/* EXPORT */

export default Utils;
