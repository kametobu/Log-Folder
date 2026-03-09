import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Extensão de log ativada!');

	// Registra o provedor de Code Folding para arquivos de linguagem 'log'
	const logFoldingProvider = vscode.languages.registerFoldingRangeProvider(
		{ language: 'log' },
		{
			provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.FoldingRange[] {
				const ranges: vscode.FoldingRange[] = [];

				// Nossas expressões regulares para achar o início e o fim
				const startRegex = />+ INICIO >+/;
				const endRegex = /<+ FINAL <+/;

				let startLine = -1;

				// Lê o arquivo linha por linha
				for (let i = 0; i < document.lineCount; i++) {
					const lineText = document.lineAt(i).text;

					if (startRegex.test(lineText)) {
						startLine = i;
					} else if (endRegex.test(lineText) && startLine >= 0) {

						ranges.push(new vscode.FoldingRange(startLine, i - 1, vscode.FoldingRangeKind.Region));
						startLine = -1;
					}
				}

				return ranges;
			}
		}
	);

	context.subscriptions.push(logFoldingProvider);
}

export function deactivate() { }