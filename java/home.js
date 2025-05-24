// ==============================
// home.js - Menu de perfil, cardápio e preview 3D
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');
  const container = document.getElementById('itensContainer');

  let categoriaAtiva = null;

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
      dropdownCardapio.classList.toggle('show');

      if (!dropdownCardapio.classList.contains('show')) {
        container.style.display = 'none';
        container.innerHTML = '';
        categoriaAtiva = null;
        modelModal.style.display = 'none';
        modelModal.innerHTML = '';
      }
    });
  }

  // ==============================
  // CARDÁPIO - Clique e Hover nos botões de categoria
  // ==============================
  document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
    const categoria = btn.getAttribute('data-categoria');
    const id = 'btnEstado_' + categoria;

    const estaDesativado = localStorage.getItem(id) === 'true';
    if (estaDesativado) {
      btn.classList.add('desativado');
    }

    btn.addEventListener('click', () => {
      const desativadoAgora = !btn.classList.contains('desativado');
      btn.classList.toggle('desativado');
      localStorage.setItem(id, desativadoAgora);

      if (desativadoAgora) {
        if (categoriaAtiva === categoria) {
          categoriaAtiva = null;
          container.innerHTML = '';
          container.style.display = 'none';
          modelModal.style.display = 'none';
          modelModal.innerHTML = '';
        }
      } else {
        categoriaAtiva = categoria;
        mostrarItens(categoria);
        container.style.display = 'flex';
      }
    });

    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('desativado') && categoriaAtiva !== categoria) {
        mostrarItens(categoria);
      }
    });
  });

  // ==============================
  // CARDÁPIO - CONTROLE DE ITENS
  // ==============================

  function mostrarItens(categoria) {
    const container = document.getElementById('itensContainer');

    if (!container || !objetos3D[categoria]) return;

    container.innerHTML = '';
    container.style.display = 'flex';

    objetos3D[categoria].forEach((nome, i) => {
      const box = document.createElement('div');
      box.className = 'item-box';
      box.textContent = nome;
      box.setAttribute('data-categoria', categoria);
      box.style.animationDelay = `${i * 0.1}s`;

      const idItem = `itemEstado_${categoria}_${nome}`;
      const estaDesativado = localStorage.getItem(idItem) === 'true';
      if (estaDesativado) {
        box.classList.add('desativado');
      }

      // Toggle ativo/desativado ao clicar
      box.addEventListener('click', () => {
        box.classList.toggle('desativado');
        const desativadoAgora = box.classList.contains('desativado');
        localStorage.setItem(idItem, desativadoAgora.toString());
      });

      container.appendChild(box);
    });

    adicionarPreview3D(); // mantém funcionalidade do preview
  }

  // ==============================
  // PREVIEW 3D - HOVER NOS ITENS
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
        // Não mostra preview se o item estiver desativado
        if (item.classList.contains('desativado')) return;

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
});
