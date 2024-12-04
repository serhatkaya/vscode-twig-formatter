# Twig Formatter

[![Version](https://img.shields.io/visual-studio-marketplace/v/serhatkaya.twig-formatter)](https://marketplace.visualstudio.com/items?itemName=serhatkaya.twig-formatter)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/serhatkaya.twig-formatter)](https://marketplace.visualstudio.com/items?itemName=serhatkaya.twig-formatter)
[![License](https://img.shields.io/github/license/serhatkaya/vscode-twig-formatter)](LICENSE.md)

## Overview

Twig Formatter is a Visual Studio Code extension designed to format Twig template files. It leverages the PrettyDiff library to provide customizable formatting options for your Twig files, ensuring your code is clean and consistent.

## Features

- Formats Twig files with customizable options.
- Supports various formatting styles and preferences.
- Integrates seamlessly with VSCode's editor settings.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for "Twig Formatter".
4. Click "Install" to install the extension.

Alternatively, you can install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=serhatkaya.twig-formatter).

## Usage

Once installed, the extension will automatically format your Twig files on save. You can also manually format a file by opening the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) and typing `Format Document`.

## Configuration

Twig Formatter offers a variety of configuration options to tailor the formatting to your needs. These can be set in your VSCode settings (`settings.json`):

```json
{
  "twig-formatter.formatting": true, // Enable/disable Twig PrettyDiff formatting.
  "twig-formatter.braceLine": false, // Insert an empty line after opening and before closing curly braces.
  "twig-formatter.bracePadding": false, // Insert space after start and before end of a container if not indented.
  "twig-formatter.braceStyle": "none", // Emulate JSBeautify's brace_style option.
  "twig-formatter.braces": false, // Determine if opening curly braces exist on the same line as their condition.
  "twig-formatter.commentLine": false, // Force a blank new line above comments.
  "twig-formatter.comments": false, // Indent comments according to the code.
  "twig-formatter.compressedCss": false, // Beautify CSS with minified properties and values.
  "twig-formatter.correct": false, // Automatically correct some sloppiness in code.
  "twig-formatter.cssInsertLines": false, // Insert new line characters between every CSS code block.
  "twig-formatter.elseLine": false, // Force 'else' keyword onto a new line.
  "twig-formatter.endComma": "none", // Trailing comma in arrays and objects.
  "twig-formatter.forceAttribute": false, // Indent all markup attributes onto their own line.
  "twig-formatter.forceIndent": false, // Force indentation upon all content and tags.
  "twig-formatter.formatArray": "default", // Indent all array indexes.
  "twig-formatter.formatObject": "default", // Indent all object keys.
  "twig-formatter.functionName": false, // Space following a JavaScript function name.
  "twig-formatter.indentStyle": "tab", // Indent using tabs or spaces.
  "twig-formatter.indentLevel": 0, // Indentation padding for beautification.
  "twig-formatter.tabSize": 0, // Number of 'inchar' values for a single indentation.
  "twig-formatter.methodChain": 0, // Break consecutively chained methods onto separate lines.
  "twig-formatter.neverFlatten": false, // Prevent flattening of destructured lists in script.
  "twig-formatter.newLine": true, // Insert an empty line at the end of output.
  "twig-formatter.noCaseIndent": false, // Case statement indentation same as switch block.
  "twig-formatter.noLeadZero": false, // Remove leading 0s in CSS values before a decimal.
  "twig-formatter.objectSort": false, // Sort markup attributes and properties by key name.
  "twig-formatter.preserve": 2, // Maximum number of consecutive empty lines to retain.
  "twig-formatter.preserveComment": false, // Prevent comment reformatting due to wrap option.
  "twig-formatter.quoteConvert": "none", // Convert quotes of script strings or markup attributes.
  "twig-formatter.space": true, // Space following the function keyword for anonymous functions.
  "twig-formatter.spaceClose": false, // Markup self-closing tags end with ' />' instead of '/>'.
  "twig-formatter.tagMerge": false, // Combine adjacent start and end markup tags into a self-closing tag.
  "twig-formatter.tagSort": false, // Sort child items of each markup parent element.
  "twig-formatter.ternaryLine": true, // Keep ternary operators on the same line.
  "twig-formatter.unformatted": false, // Preserve insides of markup tags.
  "twig-formatter.variableList": "none", // Merge consecutive JavaScript variables into a list.
  "twig-formatter.vertical": false, // Vertically align lists of assignments and properties.
  "twig-formatter.wrap": 0 // Character width limit before applying word wrap.
}
```
