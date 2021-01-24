import {

} from 'vscode-contribution-util';

import {
  ConfigurationSchema,
  ConfigurationSettingSchema,
  ConfigurationSettingScope,
  ConfigurationSettingScopes,
  JSONSchema
} from 'vscode-contribution-schema';

//#endregion Imports

//#region Util

interface SchemaPropertyRecord
{
    // Using narrowed configuration schema
    [key: string]: ConfigurationSettingSchema;
}

//#endregion Util

//#region Configuration Primatives

/**
 * TODO(disco0): Eventually this (and some of the next objects) should be used
 * to create the 'dependencies' object for schema refs.
 */
const prop: SchemaPropertyRecord =
{
    backgroundColor: {
      default: "",
      format: "color",
      type: "string"
    },
    border: {
      default: "",
      type: "string"
    },
    borderColor: {
      default: "#FFFFFF22",
      format: "color",
      type: "string"
    },
    borderRadius: {
      default: "4px",
      examples: [
        "2px",
        "0.25em",
        "2px 0px",
        "0px 0px 0px 4px",
        "10px 40px / 20px 60px",
      ],
      type: "string"
    },
    borderSpacing: {
      default: "2px",
      type: "string"
    },
    borderStyle: {
      examples: [
        "solid",
        "dotted",
        "dashed",
        "solid none",
        "none none solid none",
      ],
      type: "string",
      default: ""
    },
    borderWidth: {
      type: "string",
      default: ""
    },
    color: {
      default: "",
      format: "color",
      type: "string"
    },
    contentIconPath: {
      description:
        "An absolute path or an URI to an image to be rendered in the attachment. Either an icon or a text can be shown, but not both.",
      anyOf: [
        {
          default: "",
          format: "uri",
          type: "string"
        },
        {
          default: "",
          type: "string"
        },
      ]
    },
    contentText: {
      description:
        "Defines a text content that is shown in the attachment. Either an icon or a text can be shown, but not both.",
      default: "",
      type: "string"
    },
    cursor: {
      anyOf: [
        {
          enum: [
            "alias",
            "all-scroll",
            "auto",
            "cell",
            "context-menu",
            "col-resize",
            "copy",
            "crosshair",
            "default",
            "e-resize",
            "ew-resize",
            "grab",
            "grabbing",
            "help",
            "move",
            "n-resize",
            "ne-resize",
            "nesw-resize",
            "ns-resize",
            "nw-resize",
            "nwse-resize",
            "no-drop",
            "none",
            "not-allowed",
            "pointer",
            "progress",
            "row-resize",
            "s-resize",
            "se-resize",
            "sw-resize",
            "text",
            "vertical-text",
            "w-resize",
            "wait",
            "zoom-in",
            "zoom-out",
            "initial",
            "inherit",
          ]
        },
        {
          format: "uri"
        },
      ],
      default: "",
      description:
        "Specifies the mouse cursor to be displayed when pointing over a decoration.",
      type: "string"
    },
    filterFileRegex: {
      type: "string"
    },
    filterLanguageRegex: {
      type: "string"
    },
    fontStyle: {
      default: "",
      enum: [ "initial", "normal", "italic", "oblique", "unset", ""],
      type: "string"
    },
    fontWeight: {
      enum: [
        "initial",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "bold",
        "medium",
      ],
      type: "string",
      default: "500"
    },
    gutterIconPath: {
      type: "string",
      default: "",
      format: "uri",
      description:
        "An absolute path or an URI to an image to be rendered in the gutter."
    },
    gutterIconSize: {
      type: "string",
      default: "",
      description:
        "Specifies the size of the gutter icon. Available values are 'auto', 'contain', 'cover' and any percentage value. For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx",
      oneOf: [
        { pattern: "\\d+(\\.\\d+)%" },
        {
          enum: [
            "auto",
            "contain",
            "cover",
          ]
        },
      ]
    },
    height: {
      type: "string",
      default: ""
    },
    isWholeLine: {
      type: "boolean",
      default: false,
      description:
        "Should the decoration be rendered also on the whitespace after the line text."
    },
    letterSpacing: {
      type: "string",
      default: ""
    },
    margin: {
      type: "string",
      default: ""
    },
    opacity: {
      type: "string",
      default: "1.0",
      // Saved tests for this
      pattern: /^(?:(?:(?:[0]*|[0]*1)(?=$))|(?:(?:[0]*|[0]*1(?!\.[0]*[1-9]+)))?[\.][\d]+)$/.source,
      examples: [
        "1.0", "0.0", "0.5", "0.75"
      ]
    },
    outline: {
      type: "string",
      default: ""
    },
    outlineColor: {
      type: "string",
      default: "",
      format: "color",
      description:
        "Applied to text enclosed by a decoration. Better use 'outline' for setting one or more of the individual outline properties."
    },
    outlineStyle: {
      type: "string",
      default: "",
      description:
        "Applied to text enclosed by a decoration. Better use 'outline' for setting one or more of the individual outline properties."
    },
    outlineWidth: {
      type: "string",
      default: "",
      description:
        "Applied to text enclosed by a decoration. Better use 'outline' for setting one or more of the individual outline properties."
    },
    overviewRulerColor: {
      default: "",
      format: "color",
      type: "string",
      description:
        "The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations."
    },
    overviewRulerLane: {
      description:
        "The position in the overview ruler where the decoration should be rendered.",
      enum: ["center", "full", "left", "right"],
      type: "string",
      default: "center"
    },
    rangeBehavior: {
      enum: [1, 2, 3, 4],
      markdownEnumDescriptions: [
        "__ClosedClosed:__ The decoration's range will not widen when edits occur at the start of end.",
        "__ClosedOpen:__ The decoration's range will widen when edits occur at the end, but not at the start.",
        "__OpenClosed:__ The decoration's range will widen when edits occur at the start, but not at the end.",
        "__OpenOpen:__ The decoration's range will widen when edits occur at the start or end."
      ],
      type: "number",
      default: 3,
      markdownDescription: [
        "Customize the growing behavior of the decoration when edits occur at the edges of the decoration's range.",
        "1. *ClosedClosed*",
        "  The decoration's range will not widen when edits occur at the start of end.",
        "2. *ClosedOpen*",
        "  The decoration's range will widen when edits occur at the end, but not at the start.",
        "3. *OpenClosed*",
        "  The decoration's range will widen when edits occur at the start, but not at the end.",
        "4. *OpenOpen*",
        "  The decoration's range will widen when edits occur at the start or end."
      ].join('\n')
    },
    textDecoration: {
      default: "",
      type: "string",
      description:
        "CSS styling property that will be applied to text enclosed by a decoration."
    },
    width: {
      default: "",
      type: "string"
    },
};

//#endregion Configuration Primatives

//#region Prop List

const propList: { [key: string]: SchemaPropertyRecord } =
{
    /**
     * Decoration schema's properties list. Used for `highlight.regexes` and
     * `highlight.decorations` properties
     *
     * @see https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions
     */
    get decorationRenderOptions() { return {
          after: schemaObj.after,
          backgroundColor: prop.backgroundColor,
          before: schemaObj.before,
          border: prop.border,
          borderColor: prop.borderColor,
          borderRadius: prop.borderRadius,
          borderSpacing: prop.borderSpacing,
          borderStyle: prop.borderStyle,
          borderWidth: prop.borderWidth,
          color: prop.color,
          contentIconPath: prop.contentIconPath,
          contentText: prop.contentText,
          cursor: prop.cursor,
          dark: schemaObj.dark,
          fontStyle: prop.fontStyle,
          fontWeight: prop.fontWeight,
          gutterIconPath: prop.gutterIconPath,
          gutterIconSize: prop.gutterIconSize,
          isWholeLine: prop.isWholeLine,
          letterSpacing: prop.letterSpacing,
          light: schemaObj.light,
          opacity: prop.opacity,
          outline: prop.outline,
          outlineColor: prop.outlineColor,
          outlineStyle: prop.outlineStyle,
          outlineWidth: prop.outlineWidth,
          overviewRulerColor: prop.overviewRulerColor,
          overviewRulerLane: prop.overviewRulerLane,
          rangeBehavior: prop.rangeBehavior,
          textDecoration: prop.textDecoration
      };
    },

    /**
     * @see https://code.visualstudio.com/api/references/vscode-api#ThemableDecorationRenderOptions
     */
    get themableDecorationRenderOptions() {
      return {
          after: schemaObj.after,
          backgroundColor: prop.backgroundColor,
          before: schemaObj.before,
          border: prop.border,
          borderColor: prop.borderColor,
          borderRadius: prop.borderRadius,
          borderSpacing: prop.borderSpacing,
          borderStyle: prop.borderStyle,
          borderWidth: prop.borderWidth,
          color: prop.color,
          cursor: prop.cursor,
          fontStyle: prop.fontStyle,
          fontWeight: prop.fontWeight,
          gutterIconPath: prop.gutterIconPath,
          gutterIconSize: prop.gutterIconSize,
          letterSpacing: prop.letterSpacing,
          opacity: prop.opacity,
          outline: prop.outline,
          outlineColor: prop.outlineColor,
          outlineStyle: prop.outlineStyle,
          outlineWidth: prop.outlineWidth,
          overviewRulerColor: prop.overviewRulerColor,
          textDecoration: prop.textDecoration
      };
    },

    /**
     * @see https://code.visualstudio.com/api/references/vscode-api#ThemableDecorationAttachmentRenderOptions
     */
    get themableDecorationAttachmentRenderOptions() {
      return {
        backgroundColor: prop.backgroundColor,
        border: prop.border,
        borderColor: prop.borderColor,
        color: prop.color,
        contentIconPath: prop.contentIconPath,
        contentText: prop.contentText,
        fontStyle: prop.fontStyle,
        fontWeight: prop.fontWeight,
        height: prop.height,
        margin: prop.margin,
        opacity: prop.opacity,
        textDecoration: prop.textDecoration,
        width: prop.width
      };
    },
};

//#endregion Prop List

//#region Decoration Objects: `decoration`, `after`, `before`, `dark`, `light`

const schemaObj =
{
  /**
   * Decoration schema. Used for `highlight.regexes` and `highlight.decorations`
   */
  get decoration(): JSONSchema
  {   return {
          type: "object",
          description:
            "Object mapping regexes to an array of decorations to apply to the capturing groups",
          default: {},
          properties: propList.decorationRenderOptions
      };
  },

  /**
   * Regex flag schema. Describes flags used for decorations, restricted to
   * `g`, `m`, and `i` only.
   */
  get regexFlags(): JSONSchema {
    return {
      type: "string",
      description: "Flags used when building regexes.",
      pattern: "^((?:([gmiu])(?!.*\\2))*)$",
      default: "gi",
      examples: [
        'g', 'gm', 'gmi', 'gmiu', 'm', 'u', 'mi', 'i', 'gi'
      ]
    };
  },

  get after(): JSONSchema {
    return {
      type: "object",
      default: {},
      description:
        "Defines the rendering options of the attachment that is inserted before the decorated text.",
      properties: propList.themableDecorationAttachmentRenderOptions
    };
  },

  get before(): JSONSchema {
    return {
      type: "object",
      default: {},
      description:
        "Defines the rendering options of the attachment that is inserted before the decorated text.",
      properties: propList.themableDecorationAttachmentRenderOptions
    };
  },

  get dark(): JSONSchema {
    return {
      type: "object",
      description: "Overwrite options for dark themes.",
      default: {},
      properties: propList.themableDecorationRenderOptions
    };
  },

  get light(): JSONSchema {
    return {
      type: "object",
      description: "Overwrite options for light themes.",
      default: {},
      properties: propList.themableDecorationRenderOptions
    };
  }
};

//#endregion Decoration Objects: `decoration`, `after`, `before`, `dark`, `light`

//#region Extension Configuration Contribution Obj

/**
 * Generated configuration contribution schema object
 */
export const configurationSchema: JSONSchema =
{
  type: "object",
  title: "Highlight - Configuration",
  properties: {
    "highlight.decorations": {
      type: "object",
      description: "Default decorations from which all others inherit from",
      default: { rangeBehavior: 3 },
      properties: propList.decorationRenderOptions
    },
    "highlight.regexes": {
      type: "object",
      description:
        "Object mapping regexes to an array of decorations to apply to the capturing groups",
      default: {},
      additionalProperties: {
        properties: {
          filterFileRegex: prop.filterFileRegex,
          filterLanguageRegex: prop.filterFileRegex,
          regexFlags: schemaObj.regexFlags,
          decorations: {
            type: "array",
            items: {
              type: "object",
              default: {},
              properties: propList.decorationRenderOptions,
            }
          }
        }
      }
    },
    "highlight.regexFlags": schemaObj.regexFlags,
    "highlight.maxMatches": {
      type: "number",
      description:
        "Maximum number of matches to decorate per regex, in order not to crash the app with accidental cathastropic regexes",
      default: 250
    }
  },
};

//#endregion Extension Configuration Contribution Obj

export default configurationSchema;
