// Este arquivo é carregado pelas 3 páginas do site (index.html, projetos.html e contato.html).
// Como cada página tem elementos diferentes, usamos "if" para checar se um elemento existe
// antes de tentar usá-lo — assim, o mesmo script.js funciona em qualquer uma das páginas
// sem gerar erro procurando por algo que não está naquela página específica.

// ===================================================================
// PARTE 1: FILTRO DE PROJETOS (só existe na página projetos.html)
// ===================================================================

// Tenta pegar o grid de projetos. Se a página atual não tiver esse elemento, o valor será "null".
const gridProjetos = document.getElementById("grid-projetos");

// "if (gridProjetos)" só é verdadeiro quando o elemento realmente existe na página atual.
if (gridProjetos) {
    const botoesFiltro = document.querySelectorAll(".botao-filtro"); // Todos os botões de filtro
    const cardsProjeto = document.querySelectorAll(".card-projeto"); // Todos os cards de projeto
    const semResultados = document.getElementById("sem-resultados"); // Mensagem de "nada encontrado"

    // Função que mostra/esconde os cards de acordo com a categoria escolhida.
    function aplicarFiltroProjetos(categoriaEscolhida) {
        let visiveis = 0; // Conta quantos cards ficaram visíveis com esse filtro

        cardsProjeto.forEach(function (card) {
            // "dataset.categoria" lê o atributo "data-categoria" definido no HTML de cada card.
            const categoriaDoCard = card.dataset.categoria;

            if (categoriaEscolhida === "todos" || categoriaDoCard === categoriaEscolhida) {
                card.classList.remove("escondido"); // Mostra o card
                visiveis = visiveis + 1;
            } else {
                card.classList.add("escondido"); // Esconde o card via CSS (display: none)
            }
        });

        semResultados.textContent = visiveis === 0
            ? "Nenhum projeto encontrado para essa categoria."
            : "";
    }

    // Registra o clique em cada botão de filtro.
    botoesFiltro.forEach(function (botao) {
        botao.addEventListener("click", function () {
            // Atualiza qual botão está com a aparência "ativo"
            botoesFiltro.forEach(function (b) {
                b.classList.remove("ativo");
            });
            botao.classList.add("ativo");

            // Aplica o filtro correspondente ao botão clicado
            aplicarFiltroProjetos(botao.dataset.filtro);
        });
    });
}

// ===================================================================
// PARTE 2: FORMULÁRIO DE CONTATO + LOCALSTORAGE (só existe em contato.html)
// ===================================================================

// Chave usada para guardar as mensagens enviadas dentro do localStorage.
const CHAVE_MENSAGENS = "mensagens-contato";

// Tenta pegar o formulário de contato. Se não existir nesta página, o restante deste bloco é ignorado.
const formularioContato = document.getElementById("formulario-contato");

if (formularioContato) {
    const inputNome = document.getElementById("nome");
    const inputEmail = document.getElementById("email");
    const inputMensagem = document.getElementById("mensagem");

    const erroNome = document.getElementById("erro-nome");
    const erroEmail = document.getElementById("erro-email");
    const erroMensagem = document.getElementById("erro-mensagem");

    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const listaMensagens = document.getElementById("lista-mensagens");

    // Regex simples para validar o formato básico de um e-mail.
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Função genérica para marcar um campo como inválido (borda vermelha + mensagem de erro).
    function marcarInvalido(input, elementoErro, mensagem) {
        input.classList.remove("valido");
        input.classList.add("invalido");
        elementoErro.textContent = mensagem;
    }

    // Função genérica para marcar um campo como válido (borda verde + sem mensagem).
    function marcarValido(input, elementoErro) {
        input.classList.remove("invalido");
        input.classList.add("valido");
        elementoErro.textContent = "";
    }

    // Valida o campo de nome (mínimo 3 caracteres).
    function validarNome() {
        const valor = inputNome.value.trim();
        if (valor.length < 3) {
            marcarInvalido(inputNome, erroNome, "Digite pelo menos 3 caracteres.");
            return false;
        }
        marcarValido(inputNome, erroNome);
        return true;
    }

    // Valida o campo de e-mail usando a regex.
    function validarEmail() {
        const valor = inputEmail.value.trim();
        if (!regexEmail.test(valor)) {
            marcarInvalido(inputEmail, erroEmail, "Digite um e-mail válido.");
            return false;
        }
        marcarValido(inputEmail, erroEmail);
        return true;
    }

    // Valida o campo de mensagem (mínimo 10 caracteres).
    function validarMensagem() {
        const valor = inputMensagem.value.trim();
        if (valor.length < 10) {
            marcarInvalido(inputMensagem, erroMensagem, "Escreva pelo menos 10 caracteres.");
            return false;
        }
        marcarValido(inputMensagem, erroMensagem);
        return true;
    }

    // Valida em tempo real, enquanto o usuário digita em cada campo.
    inputNome.addEventListener("input", validarNome);
    inputEmail.addEventListener("input", validarEmail);
    inputMensagem.addEventListener("input", validarMensagem);

    // Função que lê as mensagens salvas no localStorage (ou retorna um array vazio se não houver nada).
    function carregarMensagens() {
        const dadosSalvos = localStorage.getItem(CHAVE_MENSAGENS);
        return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    }

    // Função que salva o array de mensagens no localStorage, convertendo para texto (JSON).
    function salvarMensagens(mensagens) {
        localStorage.setItem(CHAVE_MENSAGENS, JSON.stringify(mensagens));
    }

    // Função que desenha a lista de mensagens salvas na tela.
    function renderizarMensagens() {
        const mensagens = carregarMensagens(); // Busca os dados atuais salvos no navegador
        listaMensagens.innerHTML = ""; // Limpa a lista antes de redesenhar

        mensagens.forEach(function (msg) {
            const item = document.createElement("li"); // Cria um <li> para cada mensagem
            item.className = "item-mensagem"; // Aplica a classe de estilo

            // "innerHTML" aqui monta a estrutura interna do item de uma vez, com duas partes:
            // o nome de quem enviou (em negrito) e o texto da mensagem embaixo.
            item.innerHTML = `
                <div class="nome-remetente">${msg.nome}</div>
                <div class="texto-mensagem">${msg.mensagem}</div>
            `;

            listaMensagens.appendChild(item); // Insere o item na lista <ul>
        });
    }

    // Evento de envio do formulário.
    formularioContato.addEventListener("submit", function (evento) {
        evento.preventDefault(); // Impede o navegador de recarregar a página ao enviar o formulário

        const nomeValido = validarNome();
        const emailValido = validarEmail();
        const mensagemValida = validarMensagem();

        // Só prossegue se TODOS os campos estiverem válidos ao mesmo tempo.
        if (nomeValido && emailValido && mensagemValida) {
            const mensagens = carregarMensagens(); // Pega as mensagens já salvas

            // Adiciona a nova mensagem ao final do array.
            mensagens.push({
                nome: inputNome.value.trim(),
                mensagem: inputMensagem.value.trim()
            });

            salvarMensagens(mensagens); // Salva o array atualizado no localStorage
            renderizarMensagens(); // Redesenha a lista com a nova mensagem incluída

            mensagemSucesso.textContent = "Mensagem enviada com sucesso! ✅";
            formularioContato.reset(); // Limpa os campos do formulário

            // Remove as classes de "válido" dos campos, deixando o formulário visualmente limpo de novo.
            [inputNome, inputEmail, inputMensagem].forEach(function (campo) {
                campo.classList.remove("valido");
            });

            // Some com a mensagem de sucesso depois de alguns segundos.
            setTimeout(function () {
                mensagemSucesso.textContent = "";
            }, 3000);
        }
    });

    // Mostra as mensagens já salvas assim que a página de contato é carregada.
    renderizarMensagens();
}

// ===================================================================
// PARTE 3: FRASE MOTIVACIONAL VIA API (só existe em contato.html)
// ===================================================================

// Tenta pegar o elemento da frase. Só existe na página de contato.
const textoFrase = document.getElementById("texto-frase");

if (textoFrase) {
    // Função assíncrona que busca uma frase/conselho aleatório na mesma API usada no Projeto 9.
    async function buscarFraseMotivacional() {
        try {
            const resposta = await fetch("https://api.adviceslip.com/advice");

            if (!resposta.ok) {
                throw new Error("Falha ao buscar a frase.");
            }

            const dados = await resposta.json();
            textoFrase.textContent = `"${dados.slip.advice}"`; // Exibe a frase entre aspas

        } catch (erro) {
            // Se a API falhar, mostramos uma frase padrão em vez de deixar a tela quebrada.
            textoFrase.textContent = "Acredite no seu processo de aprendizado. Você está indo bem!";
            console.error("Erro ao buscar frase motivacional:", erro);
        }
    }

    // Chama a função assim que a página de contato termina de carregar, sem precisar de clique.
    buscarFraseMotivacional();
}
