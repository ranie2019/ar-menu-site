// ==============================
// index (página inicial)
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const abrirModal = document.getElementById("abrirModal");
  const fecharModal = document.getElementById("fecharModal");
  const modal = document.getElementById("modal");

  // Abrir/fechar modal de cadastro/login
  if (abrirModal && fecharModal && modal) {
    abrirModal.addEventListener("click", () => modal.classList.remove("hidden"));
    fecharModal.addEventListener("click", () => modal.classList.add("hidden"));

    // Fecha modal clicando fora da área de conteúdo
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }
});

// ==============================
// cadastro (validação, formatação, envio)
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmarSenha");
  const formCadastro = document.getElementById('formCadastro');
  const mensagemErro = document.getElementById('mensagemErro');
  const cnpjInput = document.getElementById('cnpj');
  const telefoneInput = document.getElementById('telefone');

  // Valida se as senhas coincidem
  function validarSenhas() {
    if (!senhaInput || !confirmarSenhaInput) return;
    if (senhaInput.value !== confirmarSenhaInput.value) {
      confirmarSenhaInput.setCustomValidity("As senhas não coincidem.");
    } else {
      confirmarSenhaInput.setCustomValidity("");
    }
  }

  if (senhaInput && confirmarSenhaInput) {
    senhaInput.addEventListener("input", validarSenhas);
    confirmarSenhaInput.addEventListener("input", validarSenhas);
  }

  // Controle do envio do formulário: bloqueia se senhas divergentes
  if (formCadastro && senhaInput && confirmarSenhaInput) {
    formCadastro.addEventListener('submit', (event) => {
      if (senhaInput.value !== confirmarSenhaInput.value) {
        event.preventDefault();
        if (mensagemErro) mensagemErro.style.display = 'block';
        senhaInput.value = '';
        confirmarSenhaInput.value = '';
      } else {
        if (mensagemErro) mensagemErro.style.display = 'none';
      }
    });
  }

  // Máscara para CNPJ em tempo real
  if (cnpjInput) {
    cnpjInput.addEventListener('input', function () {
      this.value = this.value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 18);
    });
  }

  // Máscara para telefone (formato: (XX) XXXXX-XXXX)
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function () {
      this.value = this.value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    });
  }
});

// ==============================
// home (menu perfil e cardápio)
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const dropdown = document.getElementById('dropdown');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');

  // Perfil: redireciona para perfil.html (desativa dropdown)
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }

  // Cardápio: alterna visibilidade do dropdown
  if (cardapioBtn && dropdownCardapio) {
    cardapioBtn.addEventListener('click', () => {
      dropdownCardapio.classList.toggle('show');
    });
  }

  // Fecha dropdown de cardápio ao clicar fora
  document.addEventListener('click', (e) => {
    if (dropdownCardapio && !dropdownCardapio.contains(e.target) && cardapioBtn !== e.target) {
      dropdownCardapio.classList.remove('show');
    }
  });
});

// ==============================
// planos (exemplo para futuras funções)
// ==============================
// Você pode inserir aqui scripts específicos para a página planos.html
// Por exemplo, controle de seleção de planos, envio, etc.

// ==============================
// CARDÁPIO - objetos 3D e controle de exibição
// ==============================
const objetos3D = {
  bebidas: ['Heineken', 'Redbull', 'Coca-Cola', 'Suco'],
  pizzas: ['Pizza Calabresa', 'Pizza Marguerita', 'Pizza 4 Queijos'],
  lanches: ['Hambúrguer', 'Cheeseburger', 'Hot Dog'],
  sobremesas: ['Sundae', 'Chocolate Quente', 'Sorvete'],
  porcoes: ['Batata Frita', 'Nuggets', 'Anéis de Cebola']
};

let categoriaAtiva = null;

// Função para mostrar/ocultar itens da categoria clicada
function mostrarItens(categoria) {
  const container = document.getElementById('itensContainer');
  if (!container || !objetos3D[categoria]) return;

  if (categoriaAtiva === categoria) {
    container.innerHTML = '';
    categoriaAtiva = null;
    return;
  }

  categoriaAtiva = categoria;
  container.innerHTML = '';

  objetos3D[categoria].forEach((nome, i) => {
    const box = document.createElement('div');
    box.className = 'item-box';
    box.textContent = nome;
    box.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(box);
  });
}
