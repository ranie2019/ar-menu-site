// ==============================
// home.js - Menu de perfil, cardápio e preview 3D
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');
  const container = document.getElementById('itensContainer');

  // Redireciona ao clicar no botão "Perfil"
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }

  // Botão "Cardápio" abre/fecha dropdown e limpa conteúdo
  if (cardapioBtn && dropdownCardapio) {
    cardapioBtn.addEventListener('click', () => {
      dropdownCardapio.classList.toggle('show');

      // Oculta os itens da categoria
      container.style.display = 'none';
      container.innerHTML = '';
      categoriaAtiva = null;

      // Oculta o preview 3D
      modelModal.style.display = 'none';
      modelModal.innerHTML = '';
    });
  }

  // Hover nos botões das categorias (exibe itens da categoria)
  document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const categoria = btn.getAttribute('data-categoria');
      mostrarItens(categoria); // Lista nomes dos itens da categoria
    });
  });

  // Clicar fora fecha o menu e oculta previews
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.profile-menu')) {
      // Nenhum menu de perfil aberto atualmente
    }

    if (!event.target.closest('.cardapio-menu')) {
      dropdownCardapio.classList.remove('show');
      container.style.display = 'none';
      container.innerHTML = '';
      categoriaAtiva = null;
      modelModal.style.display = 'none';
      modelModal.innerHTML = '';
    }
  });
});

// ==============================
// CARDÁPIO - CONTROLE DE ITENS
// ==============================

let categoriaAtiva = null; // Guarda a categoria ativa

function mostrarItens(categoria) {
  const container = document.getElementById('itensContainer');
  if (!container || !objetos3D[categoria]) return;

  if (categoriaAtiva === categoria) return; // Já está ativa

  categoriaAtiva = categoria;
  container.innerHTML = '';
  container.style.display = 'flex'; // Exibe os nomes dos itens

  // Cria elementos para cada item da categoria
  objetos3D[categoria].forEach((nome, i) => {
    const box = document.createElement('div');
    box.className = 'item-box';
    box.textContent = nome;
    box.setAttribute('data-categoria', categoria);
    box.style.animationDelay = `${i * 0.1}s`; // Efeito delay
    container.appendChild(box);
  });

  adicionarPreview3D(); // Ativa o preview ao passar o mouse
}

// ==============================
// PREVIEW 3D NO HOVER
// ==============================

const MODEL_BASE_URL = 'https://ar-menu-models.s3.amazonaws.com/';
const modelModal = document.createElement('div');
modelModal.className = 'model-preview-modal';
modelModal.style.display = 'none';
document.body.appendChild(modelModal);

// Converte o nome do item para o nome do arquivo .glb
function nomeParaArquivo(nome) {
  return nome.trim().toLowerCase().replace(/\s+/g, '_') + '.glb';
}

// Ativa o preview 3D ao passar o mouse em cima dos itens
function adicionarPreview3D() {
  document.querySelectorAll('.item-box').forEach(item => {
    const nomeObjeto = item.textContent.trim();
    const categoria = item.getAttribute('data-categoria');
    const nomeArquivo = nomeParaArquivo(nomeObjeto);
    const modelURL = `${MODEL_BASE_URL}${categoria}/${nomeArquivo}`;

    // Quando o mouse entra no nome → mostra o preview
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

    // Quando o mouse sai do nome → esconde o preview
    item.addEventListener('mouseleave', () => {
      modelModal.style.display = 'none';
      modelModal.innerHTML = '';
    });
  });
}