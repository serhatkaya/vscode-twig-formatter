const vscode = require("vscode");
const prettier = require("prettier");
const fs = require("fs");
const path = require("path");

let outputChannel;
let cachedConfig = null;

function logWithTimestamp(message) {
  const now = new Date();
  const timestamp = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  outputChannel.appendLine(`[${timestamp}] ${message}`);
}

function loadProjectConfig() {
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

function loadConfiguration() {
  const editorConfig = vscode.workspace.getConfiguration("twig-formatter");
  const projectConfig = loadProjectConfig();
  cachedConfig = { ...editorConfig, ...projectConfig };
  logWithTimestamp("Configuration loaded.");
}

function watchConfigurationChanges() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return;

  const configFilePath = path.join(
    workspaceFolders[0].uri.fsPath,
    "twig-formatter.json"
  );

  fs.watch(configFilePath, (eventType) => {
    if (eventType === "change" || eventType === "rename") {
      logWithTimestamp("twig-formatter.json changed, reloading configuration.");
      loadConfiguration();
    }
  });

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("twig-formatter")) {
      logWithTimestamp(
        "Editor configuration changed, reloading configuration."
      );
      loadConfiguration();
    }
  });
}

async function formatEntireFileWithPrettier(text, fileName) {
  try {
    const formattedText = await prettier.format(text, {
      parser: "html",
      printWidth: cachedConfig.printWidth,
      tabWidth: cachedConfig.tabSize > 0 ? cachedConfig.tabSize : 2,
      useTabs: cachedConfig.useTabs,
      semi: cachedConfig.semi,
      singleQuote: cachedConfig.singleQuote,
      trailingComma: cachedConfig.trailingComma,
      bracketSpacing: cachedConfig.bracketSpacing,
      jsxBracketSameLine: false,
      arrowParens: cachedConfig.arrowParens,
      endOfLine: cachedConfig.endOfLine,
      bracketSameLine: cachedConfig.bracketSameLine,
      plugins: [require("prettier-plugin-twig-melody")],
    });

    logWithTimestamp(`File formatted successfully: ${fileName}`);
    return formattedText;
  } catch (error) {
    logWithTimestamp(`Error while formatting ${fileName}: ${error}`);
    console.error(`TwigFormatter: Error while formatting ${fileName}:`, error);
    return text;
  }
}

async function formatDocument(document) {
  if (!cachedConfig.formatting) {
    logWithTimestamp("Formatting is disabled in the configuration.");
    return [];
  }

  const start = new vscode.Position(0, 0);
  const end = new vscode.Position(
    document.lineCount - 1,
    document.lineAt(document.lineCount - 1).text.length
  );
  const range = new vscode.Range(start, end);

  const fileName = path.basename(document.uri.fsPath);

  const formattedText = await formatEntireFileWithPrettier(
    document.getText(range),
    fileName
  );

  return [vscode.TextEdit.replace(range, formattedText)];
}

function activate(context) {
  outputChannel = vscode.window.createOutputChannel("Twig Formatter");
  logWithTimestamp("Twig Formatter extension activated.");

  loadConfiguration();
  watchConfigurationChanges();

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
