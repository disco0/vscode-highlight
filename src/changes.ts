
/* IMPORT */

import * as vscode from 'vscode';
import type {
    Range,
    TextDocumentContentChangeEvent,
    TextDocumentChangeEvent
} from 'vscode'
import Decorator from './decorator';

//#region Declarations

//#endregion Declarations

/* CHANGES */

export const Changes =

{

  changes: [] as TextDocumentContentChangeEvent[],

  onChanges ({ document, contentChanges }: TextDocumentChangeEvent) {

    if ( !contentChanges.length ) return; //URL: https://github.com/Microsoft/vscode/issues/50344

    Changes.changes.push ( ...contentChanges );

    Changes.decorate ( document );

  },

  decorate ( document: vscode.TextDocument ) {

    const areSingleLines = Changes.changes.every ( ({ range }) => range.isSingleLine );

    if ( areSingleLines ) {

      const lineNrs = Changes.changes.map ( ({ range }) => range.start.line );

      Decorator.decorateLines ( document, lineNrs );

    } else {

      Decorator.decorate ( document );

    }

    Changes.changes = [];

  }

};

/* EXPORT */

export default Changes;
