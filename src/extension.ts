import * as vscode from 'vscode';

// Cria o estilo da "caixinha" que vai aparecer do lado direito
const timeDecorationType = vscode.window.createTextEditorDecorationType({
	after: {
		margin: '0 0 0 20px',
		color: '#A8C7FA', // Azul clarinho
		backgroundColor: '#1E1E1E', // Fundo escuro
		border: '1px solid #444444',
		fontWeight: 'bold',
		textDecoration: 'none; display: inline-block;'
	}
});

export function activate(context: vscode.ExtensionContext) {

	// 1. Provedor de Code Folding (As setinhas)
	const logFoldingProvider = vscode.languages.registerFoldingRangeProvider(
		{ language: 'log' },
		{
			provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
				return analyzeLogDocument(document).foldingRanges;
			}
		}
	);

	// 2. Atualizar as caixinhas de tempo na tela
	function triggerUpdateDecorations() {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.document.languageId === 'log') {
			const decorations = analyzeLogDocument(editor.document).decorations;
			editor.setDecorations(timeDecorationType, decorations);
		}
	}

	// Gatilhos: Roda quando muda de aba ou edita o texto
	vscode.window.onDidChangeActiveTextEditor(triggerUpdateDecorations, null, context.subscriptions);
	vscode.workspace.onDidChangeTextDocument(event => {
		if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	// Roda a primeira vez que ativar
	triggerUpdateDecorations();

	context.subscriptions.push(logFoldingProvider);
}

// 3. O "Cérebro" da extensão que faz tudo de uma vez
function analyzeLogDocument(document: vscode.TextDocument) {
	const foldingRanges: vscode.FoldingRange[] = [];
	const decorations: vscode.DecorationOptions[] = [];

	const logHeaderRegex = /^(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2},\d{3})\s-\s[A-Z]+\s-\s/;
	const startAction = /\b(inici[oa]|iniciad[oa]|iniciando|importando|salvando)\b/i;
	const endAction = /\b(final|finalizad[oa]|finalizando|salva)\b/i;

	interface BlockStart {
		line: number;
		keywords: string[];
		timeMs: number;
	}

	const stack: BlockStart[] = [];

	for (let i = 0; i < document.lineCount; i++) {
		const text = document.lineAt(i).text;
		const headerMatch = text.match(logHeaderRegex);

		if (!headerMatch) continue;

		// Extrai o tempo (Substitui vírgula por ponto para o JavaScript entender os milissegundos)
		const timeString = headerMatch[1].replace(',', '.').replace(' ', 'T') + 'Z';
		const currentTimeMs = new Date(timeString).getTime();

		const message = text.replace(logHeaderRegex, '').toLowerCase();
		const cleanMessage = message.replace(/[<>\.\!]/g, ' ');

		const subjectWords = cleanMessage
			.replace(/\b(inici[oa]|iniciad[oa]|iniciando|importando|salvando|final|finalizad[oa]|finalizando|salva)\b/g, ' ')
			.split(/\s+/)
			.filter(w => w.length > 2);

		if (subjectWords.length === 0) subjectWords.push("generico");

		if (endAction.test(message)) {
			let matchedIndex = -1;

			for (let j = stack.length - 1; j >= 0; j--) {
				const startNode = stack[j];
				const hasCommonWord = subjectWords.some(word => startNode.keywords.includes(word));

				if (hasCommonWord) {
					matchedIndex = j;
					break;
				}
			}

			if (matchedIndex !== -1) {
				const startNode = stack[matchedIndex];
				const endLine = (i === startNode.line + 1) ? i : i - 1;

				// --- PARTE NOVA: Calcula e formata o tempo ---
				const durationMs = currentTimeMs - startNode.timeMs;
				let timeLabel = '';
				if (durationMs < 1000) {
					timeLabel = `${durationMs}ms`;
				} else if (durationMs < 60000) {
					// Menos de 1 minuto
					timeLabel = `${(durationMs / 1000).toFixed(2)}s`;
				} else if (durationMs < 3600000) {
					// Menos de 1 hora
					const mins = Math.floor(durationMs / 60000);
					const secs = Math.floor((durationMs % 60000) / 1000);
					timeLabel = `${mins}m ${secs}s`;
				} else {
					// 1 hora ou mais
					const hours = Math.floor(durationMs / 3600000);
					const mins = Math.floor((durationMs % 3600000) / 60000);
					const secs = Math.floor((durationMs % 60000) / 1000);
					timeLabel = `${hours}h ${mins}m ${secs}s`;
				}

				// Cria a decoração (A caixinha de tempo)
				decorations.push({
					range: new vscode.Range(startNode.line, 0, startNode.line, document.lineAt(startNode.line).text.length),
					renderOptions: {
						after: { contentText: ` ⏱️ ${timeLabel} ` }
					}
				});

				foldingRanges.push(new vscode.FoldingRange(startNode.line, endLine, vscode.FoldingRangeKind.Region));
				stack.splice(matchedIndex);
			}
		}
		else if (startAction.test(message)) {
			stack.push({ line: i, keywords: subjectWords, timeMs: currentTimeMs });
		}
	}

	return { foldingRanges, decorations };
}

export function deactivate() { }