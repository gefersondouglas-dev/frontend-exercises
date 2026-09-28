// Guarda o valor atual do contador em uma variável. "let" permite que o valor mude depois.
let valorAtual = 0;

// "document.getElementById" busca no HTML um elemento pelo seu atributo id.
// Aqui guardamos uma referência ao parágrafo que mostra o número na tela.
const elementoNumero = document.getElementById("numero");

// Guarda uma referência ao parágrafo de mensagem, pra podermos mudar o texto dele depois.
const elementoMensagem = document.getElementById("mensagem");

// Guarda uma referência ao campo de input onde o usuário digita o "passo" (de quanto em quanto conta).
const inputPasso = document.getElementById("input-passo");

// Guarda uma referência aos 3 botões da página, um de cada vez.
const botaoAumentar = document.getElementById("botao-aumentar");
const botaoDiminuir = document.getElementById("botao-diminuir");
const botaoResetar = document.getElementById("botao-resetar");

// Função que pega o valor digitado no input e transforma em número.
// "function" cria um bloco de código reutilizável, que pode ser chamado várias vezes.
function obterPasso() {
    // "Number(...)" converte o texto do input (que vem como string) em um número.
    const passo = Number(inputPasso.value);

    // Verifica se o passo é válido (maior que zero). Se não for, usamos 1 como padrão.
    if (passo > 0) {
        return passo; // "return" devolve esse valor para quem chamou a função.
    } else {
        return 1; // Valor padrão de segurança, caso o campo esteja vazio ou negativo.
    }
}

// Função responsável por atualizar o número na tela e aplicar as cores/mensagens.
function atualizarTela() {
    // "textContent" muda o texto que aparece dentro do elemento HTML.
    elementoNumero.textContent = valorAtual;

    // Remove as classes de cor antigas antes de decidir qual cor deve aparecer agora.
    // "classList.remove" tira uma classe CSS específica do elemento.
    elementoNumero.classList.remove("positivo", "negativo");

    // "if / else if / else" são estruturas condicionais: cada bloco só roda se a condição for verdadeira.
    if (valorAtual > 0) {
        // "classList.add" adiciona uma classe CSS ao elemento, mudando sua aparência.
        elementoNumero.classList.add("positivo"); // Deixa o número verde
        elementoMensagem.textContent = "Valor positivo!"; // Atualiza a mensagem
    } else if (valorAtual < 0) {
        elementoNumero.classList.add("negativo"); // Deixa o número vermelho
        elementoMensagem.textContent = "Valor negativo!"; // Atualiza a mensagem
    } else {
        elementoMensagem.textContent = "Valor zerado."; // Mensagem para quando o valor é exatamente 0
    }
}

// "addEventListener" registra uma função para rodar quando um evento acontecer (aqui, um clique).
botaoAumentar.addEventListener("click", function () {
    // Sempre que o botão "+" for clicado, este código dentro da função roda.
    valorAtual = valorAtual + obterPasso(); // Soma o passo escolhido ao valor atual
    atualizarTela(); // Chama a função que atualiza o número e a mensagem na tela
});

// Mesmo esquema para o botão de diminuir.
botaoDiminuir.addEventListener("click", function () {
    valorAtual = valorAtual - obterPasso(); // Subtrai o passo escolhido do valor atual
    atualizarTela(); // Atualiza a tela com o novo valor
});

// Evento de clique do botão de resetar.
botaoResetar.addEventListener("click", function () {
    valorAtual = 0; // Volta o valor do contador para zero
    atualizarTela(); // Atualiza a tela mostrando o valor zerado
});

// Chama a função uma vez assim que a página carrega, pra garantir que a mensagem
// inicial ("Valor zerado.") já apareça sem precisar de nenhum clique.
atualizarTela();
