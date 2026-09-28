// Array (lista) que guarda todas as tarefas. Cada tarefa é um objeto com "texto" e "concluida".
// Começamos com o array vazio, pois nenhuma tarefa foi criada ainda.
let tarefas = [];

// Guarda uma referência ao campo de texto onde o usuário digita a tarefa.
const inputTarefa = document.getElementById("input-tarefa");

// Guarda uma referência ao botão de adicionar.
const botaoAdicionar = document.getElementById("botao-adicionar");

// Guarda uma referência à lista (ul) onde as tarefas vão aparecer.
const listaTarefas = document.getElementById("lista-tarefas");

// Guarda uma referência ao parágrafo do contador de tarefas pendentes.
const contadorTarefas = document.getElementById("contador-tarefas");

// Função responsável por desenhar (renderizar) todas as tarefas na tela.
// Ela é chamada sempre que o array "tarefas" muda (adiciona, remove ou marca como concluída).
function renderizarTarefas() {
    // "innerHTML = ''" limpa todo o conteúdo da lista antes de redesenhar,
    // evitando que tarefas antigas fiquem duplicadas na tela.
    listaTarefas.innerHTML = "";

    // "forEach" percorre cada item do array "tarefas", um por um.
    // "tarefa" é o objeto atual, e "indice" é a posição dele no array (0, 1, 2...).
    tarefas.forEach(function (tarefa, indice) {

        // "document.createElement" cria um novo elemento HTML na memória (ainda não visível na tela).
        const itemLista = document.createElement("li"); // Cria um <li> para representar a tarefa
        itemLista.className = "item-tarefa"; // Aplica a classe CSS que estiliza o item

        // Cria o elemento que vai mostrar o texto da tarefa.
        const textoSpan = document.createElement("span");
        textoSpan.className = "texto-tarefa"; // Classe CSS base do texto
        textoSpan.textContent = tarefa.texto; // Define o texto visível como o texto da tarefa

        // Se a tarefa estiver marcada como concluída, adiciona a classe que risca o texto.
        if (tarefa.concluida) {
            textoSpan.classList.add("concluida");
        }

        // Ao clicar no texto da tarefa, alternamos entre concluída e não concluída.
        textoSpan.addEventListener("click", function () {
            alternarConclusao(indice); // Chama a função passando a posição dessa tarefa no array
        });

        // Cria o botão de remover ("x") de cada tarefa.
        const botaoRemover = document.createElement("button");
        botaoRemover.className = "botao-remover"; // Classe CSS do botão
        botaoRemover.textContent = "✕"; // Símbolo de "x" exibido no botão

        // Ao clicar no botão de remover, chamamos a função que tira a tarefa do array.
        botaoRemover.addEventListener("click", function () {
            removerTarefa(indice); // Passa a posição da tarefa que deve ser removida
        });

        // "appendChild" insere um elemento dentro de outro (como colocar uma peça dentro de uma caixa).
        itemLista.appendChild(textoSpan); // Coloca o texto dentro do <li>
        itemLista.appendChild(botaoRemover); // Coloca o botão de remover dentro do <li>
        listaTarefas.appendChild(itemLista); // Coloca o <li> completo dentro da lista <ul>
    });

    atualizarContador(); // Depois de redesenhar tudo, atualiza a mensagem do contador
}

// Função que adiciona uma nova tarefa ao array.
function adicionarTarefa() {
    // ".trim()" remove espaços em branco do início e do fim do texto digitado.
    const texto = inputTarefa.value.trim();

    // Se o campo estiver vazio (texto igual a ""), a função para aqui e não faz nada.
    if (texto === "") {
        return; // "return" sozinho encerra a função imediatamente
    }

    // "push" adiciona um novo item ao final do array.
    // Cada tarefa é um objeto com duas propriedades: o texto digitado e se está concluída (começa como false).
    tarefas.push({ texto: texto, concluida: false });

    inputTarefa.value = ""; // Limpa o campo de texto depois de adicionar
    renderizarTarefas(); // Redesenha a lista na tela com a nova tarefa incluída
}

// Função que alterna o estado "concluida" de uma tarefa (true vira false, false vira true).
function alternarConclusao(indice) {
    // Acessa a tarefa pela posição no array usando colchetes: tarefas[indice]
    // "!" inverte o valor booleano atual (nega o valor: true -> false, false -> true)
    tarefas[indice].concluida = !tarefas[indice].concluida;
    renderizarTarefas(); // Redesenha a lista para mostrar o texto riscado ou não
}

// Função que remove uma tarefa do array pela posição (índice).
function removerTarefa(indice) {
    // "filter" cria um NOVO array contendo apenas os itens que passarem no teste da função.
    // Aqui, mantemos todas as tarefas cujo índice seja DIFERENTE do índice que queremos remover.
    tarefas = tarefas.filter(function (tarefa, i) {
        return i !== indice; // "!==" significa "diferente de"
    });
    renderizarTarefas(); // Redesenha a lista sem a tarefa removida
}

// Função que atualiza o texto do contador de tarefas pendentes.
function atualizarContador() {
    // "filter" aqui cria um array só com as tarefas que NÃO estão concluídas.
    const pendentes = tarefas.filter(function (tarefa) {
        return tarefa.concluida === false;
    });

    // ".length" retorna quantos itens existem dentro do array.
    const quantidade = pendentes.length;

    // Operador ternário: "condição ? valorSeVerdadeiro : valorSeFalso".
    // Aqui decidimos entre a palavra "tarefa" (singular) ou "tarefas" (plural).
    const palavra = quantidade === 1 ? "tarefa pendente" : "tarefas pendentes";

    // Template string: o crase (`) permite escrever texto com variáveis dentro usando ${...}
    contadorTarefas.textContent = `Você tem ${quantidade} ${palavra}`;
}

// Evento de clique no botão "Adicionar".
botaoAdicionar.addEventListener("click", adicionarTarefa);

// Evento de teclado no campo de texto: permite adicionar a tarefa apertando Enter, sem precisar clicar no botão.
inputTarefa.addEventListener("keydown", function (evento) {
    // "evento.key" guarda qual tecla foi pressionada. Comparamos com o texto "Enter".
    if (evento.key === "Enter") {
        adicionarTarefa(); // Chama a mesma função usada pelo botão
    }
});

// Chama a função uma vez no carregamento da página, para exibir "Você tem 0 tarefas pendentes" de início.
renderizarTarefas();
