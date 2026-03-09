# 📂 Log Folder

Uma extensão essencial para desenvolvedores e analistas que trabalham com arquivos de log extensos. O **Log Folder** transforma logs de texto plano em uma estrutura hierárquica, legível e interativa dentro do VS Code.

![Logo da Extensão](images/icon.png)

## ✨ Funcionalidades Principais

### 1. ⏱️ Cálculo Automático de Tempo (Novo!)
A extensão analisa os *timestamps* do seu log e calcula exatamente quanto tempo cada etapa demorou para rodar.
* **Visualização Instantânea:** Uma etiqueta (badge) elegante aparece ao lado da linha de início.
* **Escala Inteligente:** Formata o tempo automaticamente para milissegundos (`ms`), segundos (`s`), minutos (`m s`) ou horas (`h m s`), dependendo da duração.
    * *Ex:* `⏱️ 245ms`
    * *Ex:* `⏱️ 1m 15s`

### 2. 📁 Code Folding Inteligente (Dobradura)
Chega de se perder em arquivos com 50.000 linhas.
* **Agrupamento por Contexto:** A extensão lê o conteúdo da mensagem (ex: "Importando table_X") e procura o fechamento correspondente ("Finalizado table_X"), permitindo dobras precisas mesmo em logs cruzados ou assíncronos.
* **Limpeza Visual:** Ignora cabeçalhos de data/hora na hora de identificar os blocos, focando na ação real.
* **Fim Visível:** Mantém a linha de conclusão visível quando possível, para que você saiba como o processo terminou sem precisar abrir o bloco.

### 3. 🎯 Detecção de Padrões
Funciona nativamente com logs que utilizam marcadores visuais ou verbos de ação.
* **Marcadores:** `>>>>>>>>>>>>>>>>>>>` e `<<<<<<<<<<<<<<<<<<<`
* **Verbos:** Detecta automaticamente palavras-chave como `Iniciando`, `Finalizando`, `Salvando`, `Importando`, entre outros.

---

## 🚀 Como Usar

1.  Abra qualquer arquivo com a extensão `.log`.
2.  Aguarde um instante: as setinhas de dobrar aparecerão na margem esquerda e os tempos de execução aparecerão à direita das linhas de início.
3.  Use os atalhos do VS Code para navegar:
    * **Dobrar tudo:** `Ctrl + K` depois `Ctrl + 0`
    * **Expandir tudo:** `Ctrl + K` depois `Ctrl + J`
    * **Dobrar bloco atual:** `Ctrl + Shift + [`

## ⚙️ Requisitos de Formato

Para que o **Cálculo de Tempo** funcione corretamente, seus logs devem iniciar com um timestamp no padrão ISO/Data, comum em logs Python/Java:

`YYYY-MM-DD HH:MM:SS,MMM - NIVEL - Mensagem...`

Exemplos suportados:
```log
2026-02-27 12:25:02,853 - INFO - >>> Iniciando script
...
2026-02-27 12:25:05,100 - INFO - <<< Finalizando script