// ==============================
// home.js - Menu de perfil, cardápio e preview 3D
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');
  const container = document.getElementById('itensContainer');

  // ==============================
  // PERFIL - Redirecionamento
  // ==============================
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }

  // ==============================
  // CARDÁPIO - Botão abre/fecha dropdown
  // ==============================
  if (cardapioBtn && dropdownCardapio) {
    cardapioBtn.addEventListener('click', () => {
      // Alterna visibilidade do menu dropdown
      dropdownCardapio.classList.toggle('show');

      // Reseta os conteúdos sempre que o botão do cardápio for clicado
      container.style.display = 'none';
      container.innerHTML = '';
      categoriaAtiva = null;
      modelModal.style.display = 'none';
      modelModal.innerHTML = '';

      // Remove a classe de desativado de todos os botões
      document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
        btn.classList.remove('desativado');
      });
    });
  }

  // ==============================
  // CARDÁPIO - Clique e Hover nos botões de categoria
  // ==============================
  document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
    const categoria = btn.getAttribute('data-categoria');

    // Garante que o botão comece ativado (sem a classe 'desativado')
    btn.classList.remove('desativado');

    btn.addEventListener('click', () => {
      const estaDesativado = btn.classList.contains('desativado');

      // Alterna a classe de desativado
      btn.classList.toggle('desativado');

      if (estaDesativado) {
        // Estava desativado e foi clicado → agora ativa
        categoriaAtiva = categoria;
        mostrarItens(categoria);
        container.style.display = 'flex';
      } else {
        // Estava ativado e foi clicado → agora desativa
        categoriaAtiva = null;
        container.innerHTML = '';
        container.style.display = 'none';
        modelModal.style.display = 'none';
        modelModal.innerHTML = '';
      }
    });

    // Hover só mostra os itens se o botão estiver ativado
    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('desativado') && categoriaAtiva !== categoria) {
        mostrarItens(categoria);
      }
    });
  });
});

// ==============================
// CARDÁPIO - CONTROLE DE ITENS
// ==============================

let categoriaAtiva = null; // Guarda a categoria atualmente ativa

function mostrarItens(categoria) {
  const container = document.getElementById('itensContainer');

  // Se não encontrar container ou a categoria não existir no dicionário, para
  if (!container || !objetos3D[categoria]) return;

  // Se a categoria já estiver ativa, evita recarregar
  if (categoriaAtiva === categoria) return;

  categoriaAtiva = categoria;
  container.innerHTML = '';
  container.style.display = 'flex';

  // Cria os elementos para cada item da categoria
  objetos3D[categoria].forEach((nome, i) => {
    const box = document.createElement('div');
    box.className = 'item-box';
    box.textContent = nome;
    box.setAttribute('data-categoria', categoria);
    box.style.animationDelay = `${i * 0.1}s`; // Animação em cascata
    container.appendChild(box);
  });

  adicionarPreview3D(); // Habilita o preview nos itens
}

// ==============================
// PREVIEW 3D - HOVER NOS ITENS
// ==============================

const MODEL_BASE_URL = 'https://ar-menu-models.s3.amazonaws.com/';
const modelModal = document.createElement('div');
modelModal.className = 'model-preview-modal';
modelModal.style.display = 'none';
document.body.appendChild(modelModal);

// Converte o nome do item para nome de arquivo .glb
function nomeParaArquivo(nome) {
  return nome.trim().toLowerCase().replace(/\s+/g, '_') + '.glb';
}

// Ativa o preview 3D quando o mouse passa sobre o item
function adicionarPreview3D() {
  document.querySelectorAll('.item-box').forEach(item => {
    const nomeObjeto = item.textContent.trim();
    const categoria = item.getAttribute('data-categoria');
    const nomeArquivo = nomeParaArquivo(nomeObjeto);
    const modelURL = `${MODEL_BASE_URL}${categoria}/${nomeArquivo}`;

    item.addEventListener('mouseenter', () => {
      const rect = item.getBoundingClientRect();
      modelModal.style.left = `${rect.right + 10}px`;
      modelModal.style.top = `${rect.top}px`;
      modelModal.style.display = 'block';

      modelModal.innerHTML = `
        <a-scene embedded vr-mode-ui="enabled: false" style="width: 300px; height: 200px;">
          <a-entity position="0 0 -3">
            <a-gltf-model src="${modelURL}" scale="0.5 0.5 0.5"></a-gltf-model>
          </a-entity>
          <a-light type="ambient" intensity="1.2"></a-light>
          <a-camera position="0 0 0"></a-camera>
        </a-scene>
      `;
    });

    item.addEventListener('mouseleave', () => {
      modelModal.style.display = 'none';
      modelModal.innerHTML = '';
    });
  });
}
