const vscode = require("vscode");
const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

let outputChannel;

function logWithTimestamp(message) {
  const now = new Date();
  const timestamp = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  outputChannel.appendLine(`[${timestamp}] ${message}`);
}

async function loadProjectConfig() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return null;

  const configFilePath = path.join(
    workspaceFolders[0].uri.fsPath,
    "twig-formatter.json"
  );

  logWithTimestamp(`Checking for project config at: ${configFilePath}`);

  if (fs.existsSync(configFilePath)) {
    try {
      const configFileContent = fs.readFileSync(configFilePath, "utf-8");
      logWithTimestamp("Project config loaded successfully.");
      return JSON.parse(configFileContent);
    } catch (error) {
      logWithTimestamp(`Error reading twig-formatter.json: ${error}`);
      console.error("Error reading twig-formatter.json:", error);
    }
  } else {
    logWithTimestamp("No project config found.");
  }

  return {};
}

async function formatEntireFileWithPrettier(text, config) {
  try {
    const formattedText = await prettier.format(text, {
      parser: "html",
      printWidth: config.printWidth,
      tabWidth: config.tabSize > 0 ? config.tabSize : 2,
      useTabs: config.useTabs,
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

    logWithTimestamp("File formatted successfully.");
    return formattedText;
  } catch (error) {
    logWithTimestamp(`Error while formatting: ${error}`);
    console.error("TwigFormatter: Error while formatting:", error);
    return text;
  }
}

async function formatDocument(document) {
  let config = vscode.workspace.getConfiguration("twig-formatter");

  const projectConfig = await loadProjectConfig();
  if (projectConfig) {
    config = { ...config, ...projectConfig };
  }

  if (!config.formatting) {
    logWithTimestamp("Formatting is disabled in the configuration.");
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
  outputChannel = vscode.window.createOutputChannel("Twig Formatter");
  logWithTimestamp("Twig Formatter extension activated.");

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("twig", {
      provideDocumentFormattingEdits: async function (document) {
        return await formatDocument(document);
      },
    })
  );

  context.subscriptions.push(outputChannel);
}

exports.activate = activate;
