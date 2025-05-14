// Aguardar o carregamento completo da página
document.addEventListener("DOMContentLoaded", () => {

  // Variáveis para os elementos da página
  const abrirModal = document.getElementById("abrirModal");  // Botão que abre o modal
  const fecharModal = document.getElementById("fecharModal"); // Botão para fechar o modal
  const modal = document.getElementById("modal");  // Modal
  const senhaInput = document.getElementById("senha"); // Campo de senha
  const confirmarSenhaInput = document.getElementById("confirmarSenha"); // Campo para confirmação da senha
  const btnCadastrar = document.getElementById("btnCadastrar"); // Botão de cadastro
  
  // Função para abrir o modal
  abrirModal.addEventListener("click", () => {
    modal.classList.remove("hidden"); // Remove a classe "hidden" para mostrar o modal
  });

  // Função para fechar o modal
  fecharModal.addEventListener("click", () => {
    modal.classList.add("hidden"); // Adiciona a classe "hidden" para esconder o modal
  });

  // Fecha o modal se clicar fora da área dele
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Função para validar o formulário de cadastro ao clicar no botão
  btnCadastrar.addEventListener("click", (e) => {
    // Impede o envio do formulário caso as senhas não sejam iguais
    if (senhaInput.value !== confirmarSenhaInput.value) {
      alert("As senhas não coincidem. Por favor, tente novamente.");
      e.preventDefault(); // Previne o envio do formulário
    }
  });

  // Função de validação da senha - com setCustomValidity
  function validarSenhas() {
    // Se as senhas não coincidirem, exibe a mensagem de erro
    if (senhaInput.value !== confirmarSenhaInput.value) {
      confirmarSenhaInput.setCustomValidity("As senhas não coincidem.");
    } else {
      // Caso as senhas sejam iguais, remove a mensagem de erro
      confirmarSenhaInput.setCustomValidity(""); 
    }
  }

  // Valida senhas ao digitar nos campos
  senhaInput.addEventListener("input", validarSenhas);
  confirmarSenhaInput.addEventListener("input", validarSenhas);

});

// Função para formatar o CNPJ enquanto o usuário digita
function formatarCNPJ(cnpj) {
  return cnpj
    .replace(/\D/g, '') // Remove tudo que não for número
    .replace(/^(\d{2})(\d)/, '$1.$2') // Adiciona o ponto após os dois primeiros dígitos
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Adiciona o ponto após os três próximos dígitos
    .replace(/\.(\d{3})(\d)/, '.$1/$2') // Adiciona a barra após os três próximos dígitos
    .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona o hífen após os quatro últimos dígitos
    .slice(0, 18); // Limita o tamanho máximo do CNPJ para 18 caracteres
}

// Função para formatar o telefone enquanto o usuário digita
function formatarTelefone(telefone) {
  return telefone
    .replace(/\D/g, '') // Remove tudo que não for número
    .replace(/^(\d{2})(\d)/, '($1) $2') // Adiciona o parêntese e espaço após o DDD
    .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o hífen após os 5 primeiros dígitos
    .slice(0, 15); // Limita o tamanho máximo do telefone para 15 caracteres
}

// Função para verificar se as senhas são iguais
function verificarSenhas() {
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  
  if (senha !== confirmarSenha) {
    // Exibe a mensagem de erro se as senhas não coincidirem
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.style.display = 'block';
    
    // Apaga os campos de senha
    document.getElementById('senha').value = '';
    document.getElementById('confirmarSenha').value = '';

    // Impede o envio do formulário
    return false;
  }

  // Esconde a mensagem de erro se as senhas forem iguais
  const mensagemErro = document.getElementById('mensagemErro');
  mensagemErro.style.display = 'none';

  return true;
}

// Evento para verificar senhas antes de enviar o formulário
document.getElementById('formCadastro').addEventListener('submit', function(event) {
  if (!verificarSenhas()) {
    event.preventDefault(); // Impede o envio do formulário se as senhas não coincidirem
  }
});

// Evento para formatar o campo CNPJ enquanto o usuário digita
document.getElementById('cnpj').addEventListener('input', function(event) {
  this.value = formatarCNPJ(this.value); // Formata o valor do CNPJ enquanto digita
});

// Evento para formatar o campo Telefone enquanto o usuário digita
document.getElementById('telefone').addEventListener('input', function(event) {
  this.value = formatarTelefone(this.value); // Formata o valor do telefone enquanto digita
});