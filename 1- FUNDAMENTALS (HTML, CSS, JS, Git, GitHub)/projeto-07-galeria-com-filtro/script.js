// Guarda uma referência a TODOS os botões de filtro de uma vez.
// "querySelectorAll" retorna uma lista de todos os elementos que combinam com o seletor CSS informado.
const botoesFiltro = document.querySelectorAll(".botao-filtro");

// Guarda uma referência a TODOS os itens da galeria (cada "figure").
const itensGaleria = document.querySelectorAll(".item-galeria");

// Guarda uma referência ao parágrafo de "sem resultados".
const semResultados = document.getElementById("sem-resultados");

// Função que aplica o filtro escolhido, escondendo ou mostrando cada item da galeria.
function aplicarFiltro(categoriaEscolhida) {
    // Variável que vai contar quantos itens ficaram visíveis com esse filtro.
    let itensVisiveis = 0;

    // "forEach" percorre cada item da galeria (a NodeList retornada por querySelectorAll também tem forEach).
    itensGaleria.forEach(function (item) {
        // "dataset" é como acessamos, via JS, qualquer atributo "data-*" do HTML.
        // "data-categoria" no HTML vira "item.dataset.categoria" aqui no JavaScript.
        const categoriaDoItem = item.dataset.categoria;

        // Verifica se o filtro escolhido é "todos" OU se a categoria do item bate com o filtro.
        // "||" (OU lógico) resulta em "true" se PELO MENOS UMA das condições for verdadeira.
        if (categoriaEscolhida === "todos" || categoriaDoItem === categoriaEscolhida) {
            item.classList.remove("escondido"); // Remove a classe que esconde o item (ele fica visível)
            itensVisiveis = itensVisiveis + 1; // Soma 1 ao contador de itens visíveis
        } else {
            item.classList.add("escondido"); // Adiciona a classe que esconde o item via CSS (display: none)
        }
    });

    // Se nenhum item ficou visível, mostramos uma mensagem avisando o usuário.
    if (itensVisiveis === 0) {
        semResultados.textContent = "Nenhuma imagem encontrada para essa categoria.";
    } else {
        semResultados.textContent = ""; // Limpa a mensagem se houver itens visíveis
    }
}

// Função que atualiza qual botão de filtro está com a aparência "ativo" (fundo azul).
function marcarBotaoAtivo(botaoClicado) {
    // Percorre todos os botões e remove a classe "ativo" de todos eles primeiro.
    botoesFiltro.forEach(function (botao) {
        botao.classList.remove("ativo");
    });

    // Adiciona a classe "ativo" apenas no botão que foi realmente clicado.
    botaoClicado.classList.add("ativo");
}

// Percorre cada botão de filtro para registrar um evento de clique nele.
botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
        // "botao.dataset.filtro" lê o valor do atributo "data-filtro" definido no HTML (ex: "natureza").
        const categoriaEscolhida = botao.dataset.filtro;

        aplicarFiltro(categoriaEscolhida); // Mostra/esconde os itens de acordo com a categoria escolhida
        marcarBotaoAtivo(botao); // Atualiza visualmente qual botão está selecionado
    });
});
