const vscode = require("vscode");
const prettydiff = require("prettydiff");

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

  const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  let sourceCode = document.getText(range);
  const commentedScripts = sourceCode.replace(regex, "{#!-- $& --!#}");

  // Set configuration
  options.source = commentedScripts;
  options.mode = "beautify";
  options.language = "html";
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

  let modifiedSourceCode = prettiedOutput.replace(/{#!--| --!#}/g, "");

  options.end = 0;
  options.start = 0;

  result.push(vscode.TextEdit.replace(range, modifiedSourceCode));
  return result;
}

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("twig", {
      provideDocumentFormattingEdits: function (document) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        const rng = new vscode.Range(start, end);
        return prettyDiff(document, rng);
      },
    })
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentRangeFormattingEditProvider("twig", {
      provideDocumentRangeFormattingEdits: function (document, range) {
        let end = range.end;

        if (end.character === 0) {
          end = end.translate(-1, Number.MAX_VALUE);
        } else {
          end = end.translate(0, Number.MAX_VALUE);
        }

        const rng = new vscode.Range(
          new vscode.Position(range.start.line, 0),
          end
        );
        return prettyDiff(document, rng);
      },
    })
  );
}

exports.activate = activate;
