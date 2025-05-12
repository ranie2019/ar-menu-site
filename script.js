// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", () => {

  // Elementos do modal (caso o modal seja usado no mesmo HTML)
  const abrirModal = document.getElementById("abrirModal");
  const fecharModal = document.getElementById("fecharModal");
  const modal = document.getElementById("modal");

  // Abre o modal se existir o botão
  if (abrirModal && fecharModal && modal) {
    abrirModal.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    fecharModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Elementos do formulário de cadastro
  const form = document.getElementById("formCadastro");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmarSenha");
  const mensagemErro = document.getElementById("mensagemErro");

  // Evento de envio do formulário
  if (form) {
    form.addEventListener("submit", function (event) {
      const senha = senhaInput.value;
      const confirmarSenha = confirmarSenhaInput.value;

      // Verifica se as senhas são iguais
      if (senha !== confirmarSenha) {
        event.preventDefault(); // Impede envio

        // Exibe mensagem de erro
        if (mensagemErro) {
          mensagemErro.style.display = "block";
        }

        // Apaga os campos de senha
        senhaInput.value = '';
        confirmarSenhaInput.value = '';
      } else {
        // Oculta a mensagem de erro se estiver visível
        if (mensagemErro) {
          mensagemErro.style.display = "none";
        }
      }
    });
  }

  // Evento de formatação do CNPJ
  const cnpjInput = document.getElementById('cnpj');
  if (cnpjInput) {
    cnpjInput.addEventListener('input', function () {
      this.value = formatarCNPJ(this.value);
    });
  }

  // Evento de formatação do telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function () {
      this.value = formatarTelefone(this.value);
    });
  }
});

// Função para formatar CNPJ enquanto digita: 00.000.000/0001-00
function formatarCNPJ(cnpj) {
  return cnpj
    .replace(/\D/g, '') // Remove não-números
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18); // Limita para 18 caracteres
}

// Função para formatar telefone celular: (00) 00000-0000
function formatarTelefone(telefone) {
  return telefone
    .replace(/\D/g, '') // Remove não-números
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15); // Limita para 15 caracteres
}
