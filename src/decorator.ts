/**
 * TODO: `vscode.TextEditor.id`?
 * TODO: Refine types on properties of `Decorator`, and consider migrating to class with proper
 *       initialization instead of using assertions to calm typechecker
 */

/* DECLARATIONS */

type EditorId = number | string;
interface TextEditorWithId extends vscode.TextEditor
{
    id: EditorId
}

/* IMPORT */

import * as _ from 'lodash';
import stringMatches from 'string-matches';
import * as vscode from 'vscode';
import Config from './config';
import type {
  Configuration,
  HighlightDecoration,
  HighlightRegexConfiguration
} from './config';
import Utils from './utils';

/* DECORATOR */

const Decorator = {

  /* GENERAL */

  init () {

    Decorator.initConfig ();
    Decorator.initRegexes ();
    Decorator.initTypes ();

  },

  /* CONFIG */

  config: undefined! as Configuration,

  initConfig () {

    Decorator.config = Config.get ()!;

  },

  /* REGEXES */

  regexesStrs: undefined! as string[],
  regexes: undefined! as _.Dictionary<RegExp>,

  initRegexes () {

    Decorator.regexesStrs = Object.keys ( Decorator.config.regexes );

    const res = Decorator.regexesStrs.map ( reStr => {

      const options = Decorator.config.regexes[reStr];

      return new RegExp ( reStr, options.regexFlags || Decorator.config.regexFlags );

    });

    Decorator.regexes = _.zipObject ( Decorator.regexesStrs, res );

  },

  getRegex ( reStr: string ) {

    return Decorator.regexes[reStr];

  },

  /* TYPES */

  types: [] as _.Dictionary<any>,
  typesDynamic: [] as vscode.TextEditorDecorationType[],

  initTypes () {

    if ( Decorator.types ) Decorator.undecorate ();

    const decorations = Decorator.config.decorations,
          types = Decorator.regexesStrs.map ( reStr => {

            const options = Decorator.config.regexes[reStr],
                  reDecorations = _.castArray ( options.decorations || options );

            return reDecorations.map ( options => {

              const decorationsFull = _.merge ( {}, decorations, options ),
                    decorationsStr = JSON.stringify ( decorationsFull );

              if ( /\$\d/.test ( decorationsStr ) ) { // Dynamic decorator
                const regexExecToDecorationMemoizer = (match: RegExpExecArray) => {

                  const decorationsStrReplaced = decorationsStr.replace ( /\$(\d)/g, ( m, index ) => match[index] ),
                        decorationsFullReplaced = JSON.parse ( decorationsStrReplaced );

                  const type = vscode.window.createTextEditorDecorationType ( decorationsFullReplaced );

                  Decorator.typesDynamic.push ( type );

                  return type;

                }

                return _.memoize ( regexExecToDecorationMemoizer, match => match[0] );

              } else { // Static decorator

                return vscode.window.createTextEditorDecorationType ( decorationsFull );

              }

            });

          });

    Decorator.types = _.zipObject ( Decorator.regexesStrs, types );

  },

  getTypes ( reStr: string ) {

    return Decorator.types[reStr];

  },

  getType ( reStr: string, matchNr = 0 ) {

    return Decorator.getTypes ( reStr )[matchNr];

  },

  /* DECORATIONS */

  decorations: {} as Map<EditorId, Configuration>, // Map of document id => decorations

  decorate ( target?: vscode.TextEditor | vscode.TextDocument, force?: boolean ) : void
  {

    if ( !target ) {

      const textEditor = vscode.window.activeTextEditor;

      if ( !textEditor ) return;

      return Decorator.decorate ( textEditor, force );

    }

    if ( !Utils.editor.is ( target ) ) {

      const textEditors = Utils.document.getEditors ( target );

      return textEditors.forEach ( textEditor => Decorator.decorate ( textEditor, force ) );

    }

    const textEditor = target as TextEditorWithId,
          doc = target.document,
          text = doc.getText (),
          decorations = new Map ();

    /* PARSING */

    Decorator.regexesStrs.forEach ( reStr => {

      const options = Decorator.config.regexes[reStr],
            isFiltered = Utils.document.isFiltered ( doc, options );

      if ( !isFiltered ) return;

      const re = Decorator.getRegex ( reStr ),
            matches = stringMatches ( text, re, Decorator.config.maxMatches );

      matches.forEach ( match => {

        let startIndex = match.index;

        for ( let i = 1, l = match.length; i < l; i++ ) {

          const value = match[i];

          if ( _.isUndefined ( value ) ) continue;

          const startPos = doc.positionAt ( startIndex ),
                endPos = doc.positionAt ( startIndex + value.length ),
                range = new vscode.Range ( startPos, endPos );

          let type = Decorator.getType ( reStr, i - 1 );

          if ( !type ) return;

          if ( _.isFunction ( type ) ) type = type ( match );

          const ranges = decorations.get ( type );

          decorations.set ( type, ( ranges || [] ).concat ([ range ]) );

          startIndex += value.length;

        }

      });

    });

    /* LINE COUNT */

    const prevLineCount = Decorator.docsLines[textEditor['id']];

    Decorator.docsLines[textEditor['id']] = doc.lineCount;

    /* CLEARING */

    /**
     * @TODO Shouldn't this need a get?
     */
    // @ts-expect-error ts(7052) Element implicitly has an 'any' type because type 'Map<EditorId, Configuration>' has no index signature. Did you mean to call 'Decorator.decorations.get'?
    const prevDecorations = Decorator.decorations[textEditor['id']];

    if ( force !== true
          && (
              (
                ( !prevDecorations || !prevDecorations.size )
                && !decorations.size
              ) || (
                prevLineCount === doc.lineCount
                && _.isEqual ( prevDecorations, decorations )
              )
            )
        )
        return; // Nothing changed, skipping unnecessary work //URL: https://github.com/Microsoft/vscode/issues/50415

    // @ts-expect-error ts(7052) Element implicitly has an 'any' type because type 'Map<EditorId, Configuration>' has no index signature. Did you mean to call 'Decorator.decorations.set'?
    Decorator.decorations[textEditor['id']] = decorations;

    Decorator.undecorate ();

    /* SETTING */

    decorations.forEach ( ( ranges, type ) => {

      textEditor.setDecorations ( type, ranges );

    });

  },

  docsLines: {} as Record<EditorId, number>,

  decorateLines ( doc: vscode.TextDocument, lineNrs: number[] ) {

    // Optimizing the case where:
    // 1. The line count is the same
    // 2. There were no decorations in lineNrs
    // 3. There still are no decorations in lineNrs

    const textEditor = Utils.document.getEditors ( doc )[0] as TextEditorWithId;

    if ( textEditor && Decorator.docsLines[textEditor['id']] === doc.lineCount ) {

      // @ts-expect-error ts(7052) Element implicitly has an 'any' type because type 'Map<EditorId, Configuration>' has no index signature. Did you mean to call 'Decorator.decorations.get'?
      const decorations = Decorator.decorations[textEditor['id']] as HighlightRegexConfiguration['decorations'][]

      let hadDecorations = false;

      if ( decorations ) {

        for ( let ranges of decorations.values () ) {

          if ( ranges!.find ( range => _.includes ( lineNrs, range.start.line ) || _.includes ( lineNrs, range.end.line ) ) ) {

            hadDecorations = true;

            break;

          }

        }

      }

      if ( !hadDecorations ) {

        const hasDecorations = _.isNumber ( lineNrs.find ( lineNr => {

          const line = doc.lineAt ( lineNr );

          return Decorator.regexesStrs.find ( reStr => {

            const re = Decorator.getRegex ( reStr ),
                  matches = stringMatches ( line.text, re );

            return !!matches.length;

          });

        }));

        if ( !hasDecorations ) return;

      }

    }

    Decorator.decorate ( doc );

  },

  undecorate ( textEditor: vscode.TextEditor = vscode.window.activeTextEditor! ) {

    if ( !textEditor ) return;

    const types = _.flatten ( _.values ( Decorator.types ) );

    types.forEach ( type => {

      if ( _.isFunction ( type ) ) return;

      textEditor.setDecorations ( type, [] );

    });

    Decorator.typesDynamic.forEach ( type => {

      textEditor.setDecorations ( type, [] );

    });

  }

};

/* EXPORT */

export default Decorator;
