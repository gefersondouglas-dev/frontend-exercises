// Endereço (URL) da API pública que vamos consumir.
// Esta API retorna um conselho aleatório em inglês, sem precisar de senha ou cadastro (chave de API).
const URL_API = "https://api.adviceslip.com/advice";

// Referências aos elementos do HTML.
const textoConselho = document.getElementById("texto-conselho");
const mensagemErro = document.getElementById("mensagem-erro");
const botaoBuscar = document.getElementById("botao-buscar");
const listaHistorico = document.getElementById("lista-historico");

// Array em memória que guarda os conselhos já buscados nesta sessão (enquanto a página estiver aberta).
let historico = [];

// "async function" declara uma função assíncrona: ela pode "esperar" (await) tarefas demoradas,
// como uma requisição de rede, sem travar o restante da página enquanto isso.
async function buscarConselho() {
    // "try/catch" é uma estrutura que tenta rodar um bloco de código e,
    // se algo der errado dentro dele, desvia para o bloco "catch" em vez de quebrar a página.
    try {
        prepararCarregamento(); // Coloca a tela em "modo carregando" antes de iniciar a busca

        // "await" pausa a execução desta função até a Promise do fetch ser resolvida,
        // ou seja, até a resposta da API chegar (ou falhar).
        const resposta = await fetch(URL_API);

        // "resposta.ok" é "true" quando o servidor respondeu com sucesso (status 200-299).
        // Se vier "false" (ex: erro 404 ou 500), tratamos isso como uma falha.
        if (!resposta.ok) {
            throw new Error("A API respondeu com um erro."); // "throw" força a execução ir direto pro catch
        }

        // "resposta.json()" também é assíncrono: ele lê e converte o corpo da resposta em objeto JavaScript.
        const dados = await resposta.json();

        // A API retorna algo como: { slip: { id: 123, advice: "Texto do conselho aqui" } }
        // Por isso acessamos "dados.slip.advice" para chegar até o texto do conselho.
        const conselho = dados.slip.advice;

        exibirConselho(conselho); // Mostra o conselho na tela
        adicionarAoHistorico(conselho); // Guarda esse conselho na lista de histórico da sessão

    } catch (erro) {
        // Este bloco só roda se algo no "try" acima falhar (sem internet, API fora do ar, etc.).
        exibirErro(); // Mostra uma mensagem amigável de erro para o usuário

        // "console.error" registra o erro técnico no console do navegador, útil para quem está programando,
        // mas o usuário comum nunca vê essa mensagem.
        console.error("Erro ao buscar conselho:", erro);

    } finally {
        // O bloco "finally" roda SEMPRE, tenha o "try" dado certo ou tenha caído no "catch".
        // Usamos ele para garantir que o botão volte ao normal, não importa o que aconteceu.
        finalizarCarregamento();
    }
}

// Função que prepara a interface para o estado de "carregando".
function prepararCarregamento() {
    botaoBuscar.disabled = true; // Desabilita o botão, evitando cliques repetidos durante a busca
    botaoBuscar.textContent = "Buscando..."; // Muda o texto do botão para dar feedback ao usuário
    textoConselho.classList.add("carregando"); // Aplica o estilo visual de "carregando" (cor acinzentada)
    textoConselho.textContent = "Buscando um conselho..."; // Mensagem temporária enquanto espera a API
    mensagemErro.textContent = ""; // Limpa qualquer mensagem de erro anterior
}

// Função que devolve a interface ao estado normal, depois que a busca termina (com sucesso ou erro).
function finalizarCarregamento() {
    botaoBuscar.disabled = false; // Reabilita o botão
    botaoBuscar.textContent = "Buscar novo conselho"; // Volta o texto original do botão
}

// Função que exibe o conselho recebido da API na tela.
function exibirConselho(conselho) {
    textoConselho.classList.remove("carregando"); // Remove o estilo de "carregando"
    textoConselho.textContent = conselho; // Mostra o texto do conselho vindo da API
}

// Função que exibe uma mensagem de erro amigável, sem expor detalhes técnicos ao usuário.
function exibirErro() {
    textoConselho.classList.remove("carregando");
    textoConselho.textContent = "Não foi possível buscar um conselho agora.";
    mensagemErro.textContent = "Verifique sua conexão com a internet e tente novamente.";
}

// Função que adiciona o novo conselho ao topo do histórico e redesenha a lista.
function adicionarAoHistorico(conselho) {
    // "unshift" adiciona um item no INÍCIO do array (diferente do "push", que adiciona no final).
    // Assim, o conselho mais recente sempre aparece primeiro na lista.
    historico.unshift(conselho);

    // Limita o histórico aos 5 conselhos mais recentes, removendo os mais antigos do array.
    if (historico.length > 5) {
        historico = historico.slice(0, 5); // "slice(0, 5)" pega só os 5 primeiros itens do array
    }

    renderizarHistorico(); // Redesenha a lista na tela com o histórico atualizado
}

// Função que desenha a lista de histórico na tela.
function renderizarHistorico() {
    listaHistorico.innerHTML = ""; // Limpa a lista antes de redesenhar

    historico.forEach(function (conselho) {
        const item = document.createElement("li"); // Cria um novo <li> para cada conselho do histórico
        item.textContent = conselho; // Define o texto do item como o conselho guardado
        listaHistorico.appendChild(item); // Insere o item dentro da lista <ul>
    });
}

// Evento de clique no botão: chama a função assíncrona de busca.
botaoBuscar.addEventListener("click", buscarConselho);
