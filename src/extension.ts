import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const logFoldingProvider = vscode.languages.registerFoldingRangeProvider(
		{ language: 'log' },
		{
			provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.FoldingRange[] {
				const ranges: vscode.FoldingRange[] = [];

				// Regex para pular o cabeçalho (Data, Hora, Nível)
				const logHeaderRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2},\d{3}\s-\s[A-Z]+\s-\s/;

				// Palavras que indicam uma ação de abrir ou fechar
				const startAction = /\b(inici[oa]|iniciad[oa]|iniciando|importando|salvando)\b/i;
				const endAction = /\b(final|finalizad[oa]|finalizando|salva)\b/i;

				// Agora guardamos a linha e as "palavras-chave" (o assunto) daquele bloco
				interface BlockStart {
					line: number;
					keywords: string[];
				}

				const stack: BlockStart[] = [];

				for (let i = 0; i < document.lineCount; i++) {
					const text = document.lineAt(i).text;

					// Se não tem o formato de log, pula para a próxima linha
					if (!logHeaderRegex.test(text)) continue;

					// Tira o cabeçalho e deixa tudo em minúsculo
					const message = text.replace(logHeaderRegex, '').toLowerCase();

					// Limpa setinhas, pontos e afins, mantendo underscores para nomes como "table_teste"
					const cleanMessage = message.replace(/[<>\.\!]/g, ' ');

					// Extrai o "Assunto" (Remove as palavras de ação e guarda o resto)
					const subjectWords = cleanMessage
						.replace(/\b(inici[oa]|iniciad[oa]|iniciando|importando|salvando|final|finalizad[oa]|finalizando|salva)\b/g, ' ')
						.split(/\s+/)
						.filter(w => w.length > 2); // Mantém só palavras com mais de 2 letras (ignora "do", "de")

					// Se por acaso a frase não tiver assunto, colocamos um genérico
					if (subjectWords.length === 0) subjectWords.push("generico");

					// 1. Verifica se é uma linha de FIM
					if (endAction.test(message)) {
						let matchedIndex = -1;

						// Procura de trás pra frente na pilha um início que tenha o mesmo assunto
						for (let j = stack.length - 1; j >= 0; j--) {
							const startNode = stack[j];
							// Verifica se alguma palavra do assunto do fim bate com o assunto do início
							const hasCommonWord = subjectWords.some(word => startNode.keywords.includes(word));

							if (hasCommonWord) {
								matchedIndex = j;
								break;
							}
						}

						// Se achou um par perfeito, cria a dobra!
						if (matchedIndex !== -1) {
							const startNode = stack[matchedIndex];

							// ⬇️ A NOVA LÓGICA DE DIVISÃO ESTÁ AQUI ⬇️
							// Se a linha de fim (i) é exatamente a próxima linha do início, 
							// nós escondemos o fim (usamos 'i') para a setinha poder aparecer.
							// Caso contrário, deixamos a linha final visível (i - 1).
							const endLine = (i === startNode.line + 1) ? i : i - 1;

							ranges.push(new vscode.FoldingRange(startNode.line, endLine, vscode.FoldingRangeKind.Region));

							// Remove o início da pilha (e descarta os perdidos que ficaram depois dele)
							stack.splice(matchedIndex);
						}
					}
					// 2. Se não for fim, verifica se é uma linha de INÍCIO
					else if (startAction.test(message)) {
						stack.push({ line: i, keywords: subjectWords });
					}
				}

				return ranges;
			}
		}
	);

	context.subscriptions.push(logFoldingProvider);
}

export function deactivate() { }