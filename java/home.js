// ==============================
// home.js - Menu de perfil, cardápio e preview 3D
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');
  const container = document.getElementById('itensContainer');

  let categoriaAtiva = null; // Guarda a categoria atualmente ativa

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

      // Ao fechar o dropdown, limpa o container e modal
      if (!dropdownCardapio.classList.contains('show')) {
        container.style.display = 'none';
        container.innerHTML = '';
        categoriaAtiva = null;
        modelModal.style.display = 'none';
        modelModal.innerHTML = '';
      }
      // Não altera os estados dos botões para preservar a configuração do usuário
    });
  }

  // ==============================
  // CARDÁPIO - Clique e Hover nos botões de categoria
  // ==============================
  document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
    const categoria = btn.getAttribute('data-categoria');
    const id = 'btnEstado_' + categoria;  // id para salvar estado no localStorage

    // Recupera o estado salvo e aplica
    const estaDesativado = localStorage.getItem(id) === 'true'; // true = desativado

    if (estaDesativado) {
      btn.classList.add('desativado');
    } else {
      btn.classList.remove('desativado');
    }

    btn.addEventListener('click', () => {
      const desativadoAgora = !btn.classList.contains('desativado'); // será invertido com toggle

      btn.classList.toggle('desativado');

      // Salva o novo estado (true = desativado)
      localStorage.setItem(id, desativadoAgora);

      if (desativadoAgora) {
        // Botão DESATIVADO agora (antes estava ativado)
        if (categoriaAtiva === categoria) {
          categoriaAtiva = null;
          container.innerHTML = '';
          container.style.display = 'none';
          modelModal.style.display = 'none';
          modelModal.innerHTML = '';
        }
      } else {
        // Botão ATIVADO agora (antes estava desativado)
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
    if (!container || !objetos3D[categoria]) return;

    if (categoriaAtiva === categoria) return;

    categoriaAtiva = categoria;
    container.innerHTML = '';
    container.style.display = 'flex';

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
