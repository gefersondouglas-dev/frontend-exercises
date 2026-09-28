// Guarda uma referência ao formulário inteiro.
const formulario = document.getElementById("formulario-cadastro");

// Guarda referências a cada input do formulário.
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const inputConfirmarSenha = document.getElementById("confirmar-senha");

// Guarda referências a cada elemento de erro (span) que fica abaixo dos campos.
const erroNome = document.getElementById("erro-nome");
const erroEmail = document.getElementById("erro-email");
const erroSenha = document.getElementById("erro-senha");
const erroConfirmarSenha = document.getElementById("erro-confirmar-senha");

// Guarda uma referência à mensagem de sucesso que aparece após o envio válido.
const mensagemSucesso = document.getElementById("mensagem-sucesso");

// "Regex" (expressão regular) que descreve o formato básico de um e-mail válido.
// Explicando por partes:
// ^[^\s@]+   -> começa com 1 ou mais caracteres que não sejam espaço nem @
// @          -> precisa ter um @ no meio
// [^\s@]+    -> depois do @, mais caracteres que não sejam espaço nem @ (o domínio)
// \.         -> um ponto literal (o backslash "escapa" o ponto, pois sozinho ele significa "qualquer caractere")
// [^\s@]+$   -> termina com mais caracteres que não sejam espaço nem @ (a extensão, tipo "com")
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Função que valida o campo de nome.
// Retorna "true" se for válido, e já cuida de mostrar/esconder a mensagem de erro.
function validarNome() {
    // ".trim()" remove espaços do início e do fim antes de verificar o tamanho.
    const valor = inputNome.value.trim();

    // Verifica se o nome tem pelo menos 3 caracteres.
    if (valor.length < 3) {
        mostrarErro(inputNome, erroNome, "O nome precisa ter pelo menos 3 caracteres.");
        return false; // Retorna falso, indicando que o campo é inválido
    }

    mostrarSucesso(inputNome, erroNome); // Marca o campo como válido (borda verde, sem mensagem)
    return true; // Retorna verdadeiro, indicando que o campo passou na validação
}

// Função que valida o campo de e-mail usando a regex definida acima.
function validarEmail() {
    const valor = inputEmail.value.trim();

    // ".test(valor)" verifica se o texto "valor" combina com o padrão da regex. Retorna true ou false.
    if (!regexEmail.test(valor)) {
        mostrarErro(inputEmail, erroEmail, "Digite um e-mail válido (ex: nome@exemplo.com).");
        return false;
    }

    mostrarSucesso(inputEmail, erroEmail);
    return true;
}

// Função que valida o campo de senha.
function validarSenha() {
    const valor = inputSenha.value;

    // Verifica se a senha tem pelo menos 6 caracteres.
    if (valor.length < 6) {
        mostrarErro(inputSenha, erroSenha, "A senha precisa ter pelo menos 6 caracteres.");
        return false;
    }

    mostrarSucesso(inputSenha, erroSenha);
    return true;
}

// Função que valida se a confirmação de senha é igual à senha digitada.
function validarConfirmarSenha() {
    const senha = inputSenha.value;
    const confirmacao = inputConfirmarSenha.value;

    // Compara os dois valores usando "!==" (diferente de).
    if (confirmacao !== senha || confirmacao === "") {
        mostrarErro(inputConfirmarSenha, erroConfirmarSenha, "As senhas não coincidem.");
        return false;
    }

    mostrarSucesso(inputConfirmarSenha, erroConfirmarSenha);
    return true;
}

// Função genérica que marca um campo como inválido: borda vermelha + mensagem de erro.
// Recebe o input, o elemento de erro correspondente, e o texto da mensagem.
function mostrarErro(input, elementoErro, mensagem) {
    input.classList.remove("valido"); // Garante que a classe de "válido" seja removida
    input.classList.add("invalido"); // Adiciona a classe que deixa a borda vermelha
    elementoErro.textContent = mensagem; // Escreve a mensagem de erro no span correspondente
}

// Função genérica que marca um campo como válido: borda verde + sem mensagem de erro.
function mostrarSucesso(input, elementoErro) {
    input.classList.remove("invalido"); // Remove a classe de erro, se estiver presente
    input.classList.add("valido"); // Adiciona a classe que deixa a borda verde
    elementoErro.textContent = ""; // Limpa a mensagem de erro
}

// "input" é um evento que dispara toda vez que o usuário digita algo no campo.
// Isso permite validar em tempo real, enquanto a pessoa ainda está preenchendo.
inputNome.addEventListener("input", validarNome);
inputEmail.addEventListener("input", validarEmail);
inputSenha.addEventListener("input", function () {
    validarSenha(); // Valida a própria senha
    // Se o usuário já tiver digitado algo na confirmação, revalida ela também,
    // pois mudar a senha pode fazer a confirmação deixar de bater.
    if (inputConfirmarSenha.value !== "") {
        validarConfirmarSenha();
    }
});
inputConfirmarSenha.addEventListener("input", validarConfirmarSenha);

// Evento disparado quando o formulário é enviado (clique no botão "type=submit" ou tecla Enter).
formulario.addEventListener("submit", function (evento) {
    // "preventDefault()" impede o comportamento padrão do navegador de recarregar a página ao enviar o form.
    evento.preventDefault();

    // Roda todas as validações. Usamos variáveis para guardar se cada uma passou (true) ou não (false).
    const nomeValido = validarNome();
    const emailValido = validarEmail();
    const senhaValida = validarSenha();
    const confirmacaoValida = validarConfirmarSenha();

    // "&&" (E lógico) só resulta em "true" se TODAS as condições forem verdadeiras.
    if (nomeValido && emailValido && senhaValida && confirmacaoValida) {
        // Se tudo estiver válido, mostramos a mensagem de sucesso.
        mensagemSucesso.textContent = "Conta criada com sucesso! ✅";

        // "setTimeout" agenda um código para rodar depois de um tempo (aqui, 2000 milissegundos = 2 segundos).
        setTimeout(function () {
            formulario.reset(); // Limpa todos os campos do formulário
            mensagemSucesso.textContent = ""; // Limpa a mensagem de sucesso

            // Remove as classes "valido" de todos os inputs, deixando o formulário "limpo" visualmente de novo.
            [inputNome, inputEmail, inputSenha, inputConfirmarSenha].forEach(function (input) {
                input.classList.remove("valido");
            });
        }, 2000);
    } else {
        // Se algo estiver inválido, garantimos que nenhuma mensagem de sucesso antiga fique visível.
        mensagemSucesso.textContent = "";
    }
});
