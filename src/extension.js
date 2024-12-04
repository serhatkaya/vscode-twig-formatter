const vscode = require("vscode");
const prettier = require("prettier");

async function formatEntireFileWithPrettier(text, config) {
  try {
    const formattedText = await prettier.format(text, {
      parser: "html",
      printWidth: config.printWidth,
      tabWidth: config.tabSize > 0 ? config.tabSize : 2,
      useTabs: config.indentStyle === "tab",
      semi: config.semi,
      singleQuote: config.singleQuote,
      trailingComma: config.trailingComma,
      bracketSpacing: config.bracketSpacing,
      jsxBracketSameLine: false,
      arrowParens: config.arrowParens,
      endOfLine: config.endOfLine,
      bracketSameLine: config.bracketSameLine,

      plugins: [require("prettier-plugin-twig-melody")],
    });
    return formattedText;
  } catch (error) {
    console.error("TwigFormatter: Error while formatting:", error);
    return text;
  }
}

async function formatDocument(document) {
  const config = vscode.workspace.getConfiguration("twig-formatter");

  if (!config.formatting) {
    return [];
  }

  const start = new vscode.Position(0, 0);
  const end = new vscode.Position(
    document.lineCount - 1,
    document.lineAt(document.lineCount - 1).text.length
  );
  const range = new vscode.Range(start, end);

  const formattedText = await formatEntireFileWithPrettier(
    document.getText(range),
    config
  );

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
}

exports.activate = activate;
