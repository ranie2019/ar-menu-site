// ==============================
// home (menu perfil e cardápio + preview 3D)
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const dropdown = document.getElementById('dropdown');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');
  const container = document.getElementById('itensContainer');

  // Redireciona ao clicar no botão "Perfil"
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }

  // Botão "Cardápio" abre/fecha dropdown e limpa itens e preview
  if (cardapioBtn && dropdownCardapio) {
    cardapioBtn.addEventListener('click', () => {
      dropdownCardapio.classList.toggle('show');
      dropdown.classList.remove('show');

      // Oculta o container dos nomes e limpa o conteúdo
      container.style.display = 'none';
      container.innerHTML = '';
      categoriaAtiva = null;

      // Esconde o preview 3D
      modelModal.style.display = 'none';
      modelModal.innerHTML = '';
    });
  }

  // Evento de hover nos botões das categorias do cardápio
  document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const categoria = btn.getAttribute('data-categoria');
      mostrarItens(categoria); // Mostra os nomes ao passar o mouse
    });
  });

  // Clicar fora dos menus → fecha tudo
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.profile-menu')) dropdown.classList.remove('show');

    if (!event.target.closest('.cardapio-menu')) {
      dropdownCardapio.classList.remove('show');
      container.style.display = 'none'; // <-- Adicionado aqui também
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

let categoriaAtiva = null; // Guarda a categoria atualmente ativa

function mostrarItens(categoria) {
  const container = document.getElementById('itensContainer');
  if (!container || !objetos3D[categoria]) return;

  if (categoriaAtiva === categoria) return;

  categoriaAtiva = categoria;
  container.innerHTML = '';
  container.style.display = 'flex'; // Mostra os itens

  objetos3D[categoria].forEach((nome, i) => {
    const box = document.createElement('div');
    box.className = 'item-box';
    box.textContent = nome;
    box.setAttribute('data-categoria', categoria);
    box.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(box);
  });

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
