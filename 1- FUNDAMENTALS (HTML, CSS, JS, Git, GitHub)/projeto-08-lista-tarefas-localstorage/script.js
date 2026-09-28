// Chave (nome) usada para guardar as tarefas dentro do localStorage.
// Usar uma constante evita erros de digitação se precisarmos usar essa chave em vários lugares.
const CHAVE_ARMAZENAMENTO = "lista-de-tarefas";

// Array que guarda as tarefas em memória, igual ao projeto anterior.
// Só que agora, em vez de começar sempre vazio, ele começa com o que já estiver salvo no navegador.
let tarefas = carregarTarefas();

// Referências aos elementos do HTML (mesmo esquema dos projetos anteriores).
const inputTarefa = document.getElementById("input-tarefa");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoLimpar = document.getElementById("botao-limpar");

// Função que lê as tarefas salvas no localStorage e devolve como um array pronto para uso.
function carregarTarefas() {
    // "localStorage.getItem(chave)" busca o valor salvo com aquela chave. Se não existir, retorna "null".
    const dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);

    // O localStorage só guarda TEXTO (strings), nunca arrays ou objetos diretamente.
    // Por isso, quando salvamos, transformamos o array em texto (JSON.stringify),
    // e quando carregamos, precisamos fazer o processo inverso (JSON.parse) para virar array de novo.
    if (dadosSalvos) {
        return JSON.parse(dadosSalvos); // Converte o texto salvo de volta em array/objeto JavaScript
    }

    // Se não havia nada salvo ainda (primeira vez que a pessoa usa a página), começamos com array vazio.
    return [];
}

// Função que salva o array "tarefas" atual dentro do localStorage.
function salvarTarefas() {
    // "JSON.stringify(valor)" transforma um array ou objeto JavaScript em uma string de texto (formato JSON).
    const dadosEmTexto = JSON.stringify(tarefas);

    // "localStorage.setItem(chave, valor)" salva o texto no navegador, associado à chave escolhida.
    // Esses dados continuam salvos mesmo depois de fechar a aba ou desligar o computador.
    localStorage.setItem(CHAVE_ARMAZENAMENTO, dadosEmTexto);
}

// Função que desenha (renderiza) todas as tarefas na tela — igual ao projeto anterior.
function renderizarTarefas() {
    listaTarefas.innerHTML = ""; // Limpa a lista antes de redesenhar

    tarefas.forEach(function (tarefa, indice) {
        const itemLista = document.createElement("li");
        itemLista.className = "item-tarefa";

        const textoSpan = document.createElement("span");
        textoSpan.className = "texto-tarefa";
        textoSpan.textContent = tarefa.texto;

        if (tarefa.concluida) {
            textoSpan.classList.add("concluida");
        }

        textoSpan.addEventListener("click", function () {
            alternarConclusao(indice);
        });

        const botaoRemover = document.createElement("button");
        botaoRemover.className = "botao-remover";
        botaoRemover.textContent = "✕";

        botaoRemover.addEventListener("click", function () {
            removerTarefa(indice);
        });

        itemLista.appendChild(textoSpan);
        itemLista.appendChild(botaoRemover);
        listaTarefas.appendChild(itemLista);
    });

    atualizarContador();
}

// Função que adiciona uma nova tarefa.
function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    if (texto === "") {
        return;
    }

    tarefas.push({ texto: texto, concluida: false });

    inputTarefa.value = "";

    salvarTarefas(); // NOVO: depois de mudar o array, salvamos no localStorage imediatamente
    renderizarTarefas(); // Redesenha a tela com a tarefa nova
}

// Função que alterna o estado "concluida" de uma tarefa.
function alternarConclusao(indice) {
    tarefas[indice].concluida = !tarefas[indice].concluida;

    salvarTarefas(); // NOVO: qualquer mudança no array precisa ser salva de novo
    renderizarTarefas();
}

// Função que remove uma tarefa específica pelo índice.
function removerTarefa(indice) {
    tarefas = tarefas.filter(function (tarefa, i) {
        return i !== indice;
    });

    salvarTarefas(); // NOVO: salva o array já sem a tarefa removida
    renderizarTarefas();
}

// Função que remove do array TODAS as tarefas que já estão concluídas de uma vez.
function limparConcluidas() {
    // Mantém no array apenas as tarefas que NÃO estão concluídas.
    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.concluida === false;
    });

    salvarTarefas(); // Salva o array atualizado, já sem as tarefas concluídas
    renderizarTarefas();
}

// Função que atualiza o texto do contador de tarefas pendentes.
function atualizarContador() {
    const pendentes = tarefas.filter(function (tarefa) {
        return tarefa.concluida === false;
    });

    const quantidade = pendentes.length;
    const palavra = quantidade === 1 ? "tarefa pendente" : "tarefas pendentes";
    contadorTarefas.textContent = `${quantidade} ${palavra}`;
}

// Eventos de clique e teclado (mesmo esquema do projeto anterior).
botaoAdicionar.addEventListener("click", adicionarTarefa);

inputTarefa.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        adicionarTarefa();
    }
});

botaoLimpar.addEventListener("click", limparConcluidas);

// Renderiza a tela assim que a página carrega.
// Como "tarefas" já começou com os dados vindos do localStorage (linha lá em cima),
// isso significa que qualquer tarefa salva anteriormente aparece de volta na tela automaticamente.
renderizarTarefas();
