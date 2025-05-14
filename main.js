document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // 1. MODAL DE CADASTRO
  // ==============================

  const abrirModal = document.getElementById("abrirModal");
  const fecharModal = document.getElementById("fecharModal");
  const modal = document.getElementById("modal");

  // Abre e fecha o modal de login/cadastro
  if (abrirModal && fecharModal && modal) {
    abrirModal.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    fecharModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Fecha modal ao clicar fora da caixa de conteúdo
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // ==============================
  // 2. VALIDAÇÃO DE SENHA
  // ==============================

  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmarSenha");

  // Verifica se as senhas digitadas coincidem
  function validarSenhas() {
    if (senhaInput && confirmarSenhaInput) {
      if (senhaInput.value !== confirmarSenhaInput.value) {
        confirmarSenhaInput.setCustomValidity("As senhas não coincidem.");
      } else {
        confirmarSenhaInput.setCustomValidity("");
      }
    }
  }

  if (senhaInput && confirmarSenhaInput) {
    senhaInput.addEventListener("input", validarSenhas);
    confirmarSenhaInput.addEventListener("input", validarSenhas);
  }

  // ==============================
  // 3. ENVIO DO FORMULÁRIO
  // ==============================

  const formCadastro = document.getElementById('formCadastro');
  const mensagemErro = document.getElementById('mensagemErro');

  // Impede o envio se as senhas forem diferentes
  if (formCadastro && senhaInput && confirmarSenhaInput) {
    formCadastro.addEventListener('submit', function (event) {
      if (senhaInput.value !== confirmarSenhaInput.value) {
        event.preventDefault(); // Bloqueia envio do formulário
        if (mensagemErro) {
          mensagemErro.style.display = 'block';
        }
        senhaInput.value = '';
        confirmarSenhaInput.value = '';
      } else {
        if (mensagemErro) {
          mensagemErro.style.display = 'none';
        }
      }
    });
  }

  // ==============================
  // 4. FORMATAÇÃO DE CNPJ
  // ==============================

  const cnpjInput = document.getElementById('cnpj');

  // Aplica máscara no campo de CNPJ em tempo real
  if (cnpjInput) {
    cnpjInput.addEventListener('input', function () {
      this.value = this.value
        .replace(/\D/g, '')                             // Remove tudo que não for número
        .replace(/^(\d{2})(\d)/, '$1.$2')               // Coloca ponto depois dos 2 primeiros dígitos
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')   // Segundo ponto
        .replace(/\.(\d{3})(\d)/, '.$1/$2')             // Barra
        .replace(/(\d{4})(\d)/, '$1-$2')                // Hífen
        .slice(0, 18);                                  // Limita tamanho
    });
  }

  // ==============================
  // 5. FORMATAÇÃO DE TELEFONE
  // ==============================

  const telefoneInput = document.getElementById('telefone');

  // Aplica máscara de telefone no formato (XX) XXXXX-XXXX
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function () {
      this.value = this.value
        .replace(/\D/g, '')                            // Remove caracteres não numéricos
        .replace(/^(\d{2})(\d)/, '($1) $2')            // Adiciona parênteses nos dois primeiros
        .replace(/(\d{5})(\d)/, '$1-$2')               // Adiciona hífen depois de 5 dígitos
        .slice(0, 15);                                 // Limita a 15 caracteres
    });
  }

  // ==============================
  // 6. MENU DE PERFIL (HOME)
  // ==============================

  const profileBtn = document.getElementById('profile-btn');
  const dropdown = document.getElementById('dropdown');

  // Alterna o dropdown ao clicar no botão de perfil
  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // Evita fechar ao clicar no próprio botão
      dropdown.classList.toggle('show');
    });

    // Fecha dropdown se clicar fora dele
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

});
