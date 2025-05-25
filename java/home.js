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

// ==============================
// GARÇONS - Cadastro
// ==============================

function setupCadastroGarcons() {
  const inputQuantidade = document.getElementById('quantidadeGarcons');
  const btnMais = document.getElementById('btnMaisGarcom');
  const btnMenos = document.getElementById('btnMenosGarcom');
  const containerFormularios = document.getElementById('formularioGarcons');

  function formatarCelular(value) {
    value = value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2})/, '($1');
    }
    return value;
  }

  function adicionarEventoFormatacao(input) {
    input.addEventListener('input', (e) => {
      const posicaoCursor = input.selectionStart;
      const valorAnterior = input.value;
      input.value = formatarCelular(input.value);
      const novaPosicaoCursor = posicaoCursor + (input.value.length - valorAnterior.length);
      input.setSelectionRange(novaPosicaoCursor, novaPosicaoCursor);
      const form = input.closest('.form-garcom');
      const inputNome = form.querySelector('.nome-garcom');
      if (input.value.trim() === '') {
        inputNome.value = '';
      }
    });
  }

  function validarCampos(form) {
    const inputNome = form.querySelector('.nome-garcom');
    const inputTel = form.querySelector('.tel-garcom');
    const btnQr = form.querySelector('.btn-qr');
    const nomeValido = inputNome.value.trim().length > 0;
    const telValido = inputTel.value.trim().length >= 14;
    btnQr.disabled = !(nomeValido && telValido);
  }

  function adicionarEventosValidacao(form) {
    const inputNome = form.querySelector('.nome-garcom');
    const inputTel = form.querySelector('.tel-garcom');

    inputNome.addEventListener('input', () => validarCampos(form));
    inputTel.addEventListener('input', () => {
      validarCampos(form);
      if (inputTel.value.trim() === '') {
        inputNome.value = '';
      }
    });
  }

  function gerarFormulariosGarcons(qtd) {
    const dadosAtuais = {};
    containerFormularios.querySelectorAll('.form-garcom').forEach(form => {
      const id = form.querySelector('.nome-garcom').getAttribute('data-id');
      dadosAtuais[id] = {
        nome: form.querySelector('.nome-garcom').value,
        tel: form.querySelector('.tel-garcom').value
      };
    });

    containerFormularios.innerHTML = '';
    for (let i = 1; i <= qtd; i++) {
      const form = document.createElement('div');
      form.className = 'form-garcom';
      const nomeSalvo = dadosAtuais[i]?.nome || '';
      const telSalvo = dadosAtuais[i]?.tel || '';
      form.innerHTML = `
        <label>Garçom ${i}:</label><br>
        <input type="text" placeholder="Nome" class="nome-garcom" data-id="${i}" value="${nomeSalvo}">
        <input type="tel" placeholder="Telefone" class="tel-garcom" data-id="${i}" maxlength="15" value="${telSalvo}">
        <button class="btn-qr" data-id="${i}" disabled>Gerar QR Code</button>
      `;
      containerFormularios.appendChild(form);
      const inputTel = form.querySelector('.tel-garcom');
      adicionarEventoFormatacao(inputTel);
      adicionarEventosValidacao(form);
      validarCampos(form);
    }
  }

  inputQuantidade.addEventListener('change', () => {
    let val = parseInt(inputQuantidade.value);
    if (val < 1) val = 1;
    gerarFormulariosGarcons(val);
  });

  btnMais.addEventListener('click', () => {
    inputQuantidade.value = parseInt(inputQuantidade.value) + 1;
    inputQuantidade.dispatchEvent(new Event('change'));
  });

  btnMenos.addEventListener('click', () => {
    inputQuantidade.value = Math.max(1, parseInt(inputQuantidade.value) - 1);
    inputQuantidade.dispatchEvent(new Event('change'));
  });

  gerarFormulariosGarcons(1);
}

// ==============================
// QR Code local (sem limite)
// ==============================

function setupQrCodeGarcons() {
  const modalQrCode = document.getElementById('modalQrCode');
  const qrCodeContainer = document.getElementById('qrcodeContainer');
  const btnFecharModal = modalQrCode.querySelector('.fechar-modal');
  const containerFormularios = document.getElementById('formularioGarcons');

  containerFormularios.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-qr') && !e.target.disabled) {
      const id = e.target.getAttribute('data-id');
      const nomeInput = document.querySelector(`.nome-garcom[data-id="${id}"]`);
      const nome = nomeInput.value.trim() || `garcom${id}`;

      // URL final que o QR Code vai apontar
      const urlPedido = `https://arcardapio.com.br/pedido.html?garcom=${encodeURIComponent(nome)}`;

      // Limpa conteúdo anterior
      qrCodeContainer.innerHTML = '';

      // Gera novo QR Code localmente (sem API externa)
      new QRCode(qrCodeContainer, {
        text: urlPedido,
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      // Mostra modal
      modalQrCode.classList.add('ativo');
    }
  });

  // Fechar modal
  btnFecharModal.addEventListener('click', () => {
    modalQrCode.classList.remove('ativo');
    qrCodeContainer.innerHTML = '';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modalQrCode) {
      modalQrCode.classList.remove('ativo');
      qrCodeContainer.innerHTML = '';
    }
  });
}

// Chamada das funções
setupCadastroGarcons();
setupQrCodeGarcons();
