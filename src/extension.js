const vscode = require("vscode");
const prettydiff = require("prettydiff");
import * as prettier from "prettier";

const editor = vscode.workspace.getConfiguration("editor");
const config = vscode.workspace.getConfiguration("twig-formatter");

function prettyDiff(document, range) {
  const result = [];
  let prettiedOutput = "";
  let options = prettydiff.options;

  let tabSize = editor.tabSize;
  let indentChar = " ";

  if (config.tabSize > 0) {
    tabSize = config.tabSize;
  }

  if (config.indentStyle == "tab") {
    tabSize = 0;
    indentChar = "\t";
  }

  let sourceCode = document.getText(range);

  // Set configuration
  options.source = sourceCode;
  options.mode = "beautify";
  options.language = "twig";
  options.lexer = "markup";
  options.indent_char = indentChar;
  options.indent_size = tabSize;
  options.brace_line = config.braceLine;
  options.brace_padding = config.bracePadding;
  options.brace_style = config.braceStyle;
  options.braces = config.braces;
  options.comment_line = config.commentLine;
  options.comments = config.comments;
  options.compressed_css = config.compressedCss;
  options.correct = config.correct;
  options.cssInsertLines = config.cssInsertLines;
  options.else_line = config.elseLine;
  options.end_comma = config.endComma;
  options.force_attribute = config.forceAttribute;
  options.force_indent = config.forceIndent;
  options.format_array = config.formatArray;
  options.format_object = config.formatObject;
  options.function_name = config.functionName;
  options.indent_level = config.indentLevel;
  options.indent_char = indentChar;
  options.indent_size = tabSize;
  options.method_chain = config.methodChain;
  options.never_flatten = config.neverFlatten;
  options.new_line = config.newLine;
  options.no_case_indent = config.noCaseIndent;
  options.no_lead_zero = config.noLeadZero;
  options.object_sort = config.objectSort;
  options.preserve = config.preserve;
  options.preserve_comment = config.preserveComment;
  options.quote_convert = config.quoteConvert;
  options.space = config.space;
  options.space_close = config.spaceSlose;
  options.tag_merge = config.tagMerge;
  options.tag_sort = config.tagSort;
  options.ternary_line = config.ternaryLine;
  options.unformatted = config.unformatted;
  options.variable_list = config.variableList;
  options.vertical = config.vertical;
  options.wrap = config.wrap;

  prettiedOutput = prettydiff();

  options.end = 0;
  options.start = 0;

  result.push(vscode.TextEdit.replace(range, prettiedOutput));
  return result;
}

async function formatJavaScriptInTwig(text) {
  const jsRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let formattedText = text;

  let match;
  while ((match = jsRegex.exec(text)) !== null) {
    const scriptAttributes = match[1];
    const jsCode = match[2];
    try {
      // Format Js code asynchronously with Prettier options
      const formattedJsCode = await prettier.format(jsCode, {
        parser: "babel",
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: "es5",
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: "avoid",
        endOfLine: "lf",
      });

      const indentedJsCode = formattedJsCode
        .split("\n")
        .map((line) => `\t${line}`) // Add a tab for indentation
        .join("\n")
        .trimEnd();

      // Replace the script content while preserving attributes
      formattedText = formattedText.replace(
        match[0],
        `<script${scriptAttributes}>\n${indentedJsCode}\n</script>`
      );
    } catch (error) {
      console.error("Error formatting JavaScript code:", error);
    }
  }

  return formattedText;
}

async function formatDocument(document) {
  const start = new vscode.Position(0, 0);
  const end = new vscode.Position(
    document.lineCount - 1,
    document.lineAt(document.lineCount - 1).text.length
  );
  const range = new vscode.Range(start, end);

  // First, format the Twig content
  const twigFormatted = prettyDiff(document, range);

  // Then, format the Js within the formatted Twig content
  const formattedText = await formatJavaScriptInTwig(twigFormatted[0].newText);

  return [vscode.TextEdit.replace(range, formattedText)];
}

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("twig", {
      provideDocumentFormattingEdits: async function (document) {
        return await formatDocument(document);
      },
    })
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentRangeFormattingEditProvider("twig", {
      provideDocumentRangeFormattingEdits: async function (document, range) {
        const text = document.getText(range);
        const formattedText = await formatJavaScriptInTwig(text);
        return [vscode.TextEdit.replace(range, formattedText)];
      },
    })
  );
}

exports.activate = activate;
