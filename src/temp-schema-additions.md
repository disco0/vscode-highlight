# Regexp Flags
  - `u` flag
    - In validation pattern
    - Examples
``` json
{
  "regexFlags": {
      "type": "string",
      "description": "Flags used when building regexes.",
      "pattern": "^((?:([gmiu])(?!.*\\2))*)$",
      "default": "gi",
      "examples": [
          "g",
          "gm",
          "gmi",
          "u",
          "m",
          "mi",
          "i",
          "gi"
      ]
  },
}
  ```

# Configuration File
  - `configPath` configuration point
    Path to file containing extension configuration

``` json
"highlight.configPath": {
    "type": "string",
    "description": "Path to external extension configuration file.",
    "title": "Configuration file path",
    "examples":
    [
        "~/.highlight.config.json"
    ]
},
```

# Etc
 - Trimmed periods on configuration point descriptions
