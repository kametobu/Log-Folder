# Log Folder

Uma extensão simples e poderosa para o VS Code que adiciona a funcionalidade de **Code Folding** (dobradura de código) inteligente em arquivos de log.

## 🚀 Funcionalidades

*   **Dobradura Inteligente:** Reconhece blocos de início e fim no seu log, permitindo colapsar seções inteiras para facilitar a leitura de arquivos gigantescos.
*   **Agrupamento por Assunto:** Analisa o contexto da mensagem (ex: liga "importando table_teste" com "finalizado importacao table_teste") para garantir que a dobra seja exata, mesmo se houver logs paralelos ou cruzados.
*   **Foco no Conteúdo:** Pula automaticamente o cabeçalho de timestamp e nível de log (`YYYY-MM-DD HH:MM:SS - LEVEL -`) para focar na ação real.
*   **Suporte a Marcadores:** Lida perfeitamente com marcadores visuais no texto, como `>>>>>>>>>>>>>>>>>>>` e `<<<<<<<<<<<<<<<<<<<`.

## 📦 Como Usar

1. Abra qualquer arquivo com a extensão `.log` no seu VS Code.
2. Passe o mouse sobre a numeração das linhas. As setinhas de colapsar (`v` e `>`) aparecerão automaticamente nos pontos de início de um processo.
3. Você também pode usar os atalhos padrão do VS Code: 
   * `Ctrl + Shift + [` para dobrar
   * `Ctrl + Shift + ]` para expandir.

## ⚙️ Palavras-chave Reconhecidas

A extensão identifica blocos baseando-se em ações. Algumas das palavras suportadas (ignorando maiúsculas e minúsculas) incluem:
*   **Início:** *iniciando, iniciado, inicio, inicia, importando, salvando*
*   **Fim:** *finalizando, finalizado, final, salva*

---
*Desenvolvido para facilitar a análise visual de logs complexos.*