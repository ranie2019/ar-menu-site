// ==============================
// home (menu perfil e cardápio + preview 3D)
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const dropdown = document.getElementById('dropdown');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');

  // Alterna o menu "Perfil"
  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });
  }

  // Alterna o menu "Cardápio"
  if (cardapioBtn && dropdownCardapio) {
    cardapioBtn.addEventListener('click', () => {
      dropdownCardapio.classList.toggle('show');

      // Se o menu foi fechado, limpa os itens exibidos
      const container = document.getElementById('itensContainer');
      if (!dropdownCardapio.classList.contains('show') && container) {
        container.innerHTML = '';
        categoriaAtiva = null;
      }
    });
  }
});

// ==============================
// CARDÁPIO - CONTROLE DE ITENS
// ==============================
let categoriaAtiva = null;

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

  // Atualiza os eventos de hover para preview 3D após criar os itens
  adicionarPreview3D();
}

// ==============================
// PREVIEW 3D NO HOVER
// ==============================
const MODEL_BASE_URL = 'https://ar-menu-models.s3.amazonaws.com/';

const modelModal = document.createElement('div');
modelModal.className = 'model-preview-modal';
modelModal.style.display = 'none';
document.body.appendChild(modelModal);

function nomeParaArquivo(nome) {
  return nome.trim().toLowerCase().replace(/\s+/g, '_') + '.glb';
}

function adicionarPreview3D() {
  document.querySelectorAll('.item-box').forEach(item => {
    const nomeObjeto = item.textContent.trim();
    const nomeArquivo = nomeParaArquivo(nomeObjeto);

    item.addEventListener('mouseenter', () => {
      const rect = item.getBoundingClientRect();
      modelModal.style.left = `${rect.right + 10}px`;
      modelModal.style.top = `${rect.top}px`;
      modelModal.style.display = 'block';

      modelModal.innerHTML = `
        <a-scene embedded vr-mode-ui="enabled: false" style="width: 300px; height: 200px;">
          <a-entity position="0 0 -3">
            <a-gltf-model src="${MODEL_BASE_URL}${nomeArquivo}" scale="0.5 0.5 0.5"></a-gltf-model>
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
