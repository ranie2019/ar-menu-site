// ==============================
// home.js - Menu de perfil, cardápio e preview 3D
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  inicializarBotoesMenu();
  renderizarFormulariosGarcons();
  mostrarPreviewInicial();
});

// ==============================
// PERFIL - Redirecionamento
// ==============================
function inicializarBotoesMenu() {
  const profileBtn = document.getElementById('profile-btn');
  const cardapioBtn = document.getElementById('cardapio-btn');
  const dropdownCardapio = document.getElementById('dropdownCardapio');
  const container = document.getElementById('itensContainer');

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }

  if (cardapioBtn && dropdownCardapio) {
    cardapioBtn.addEventListener('click', () => {
      dropdownCardapio.classList.toggle('show');
      container.style.display = 'none';
      container.innerHTML = '';
      categoriaAtiva = null;
      modelModal.style.display = 'none';
      modelModal.innerHTML = '';
      document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
        btn.classList.remove('inactive');
      });
    });
  }

  document.querySelectorAll('#dropdownCardapio button').forEach(btn => {
    const categoria = btn.getAttribute('data-categoria');
    btn.classList.remove('desativado');

    btn.addEventListener('click', () => {
      const estaDesativado = btn.classList.toggle('desativado');
      if (!estaDesativado) {
        mostrarItens(categoria);
      } else {
        container.innerHTML = '';
        container.style.display = 'none';
        modelModal.style.display = 'none';
        modelModal.innerHTML = '';
        categoriaAtiva = null;
      }
    });

    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('desativado')) {
        mostrarItens(categoria);
      }
    });
  });
}

// ==============================
// CARDÁPIO - CONTROLE DE ITENS
// ==============================

let categoriaAtiva = null;

function mostrarItens(categoria) {
  const container = document.getElementById('itensContainer');
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

    box.addEventListener('click', () => {
      box.classList.toggle('desativado');
    });

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

// ==============================
// PREVIEW AUTOMÁTICO NA HOME
// ==============================

function mostrarPreviewInicial() {
  const container = document.getElementById('itensContainer');
  const categoria = 'bebidas'; // pode ser alterado para outra categoria padrão
  const nomeArquivo = 'absolut_vodka_1l.glb';
  const modelURL = `${MODEL_BASE_URL}${categoria}/${nomeArquivo}`;

  modelModal.style.display = 'block';
  modelModal.style.left = 'calc(50% - 150px)';
  modelModal.style.top = '100px';
  modelModal.innerHTML = `
    <a-scene embedded vr-mode-ui="enabled: false" style="width: 300px; height: 200px;">
      <a-entity position="0 0 -3">
        <a-gltf-model src="${modelURL}" scale="0.5 0.5 0.5"></a-gltf-model>
      </a-entity>
      <a-light type="ambient" intensity="1.2"></a-light>
      <a-camera position="0 0 0"></a-camera>
    </a-scene>
  `;
}

// ==============================
// CONTROLE DE GARÇONS - Cadastro e QRCode
// ==============================

let quantidadeAtual = 1;

function alterarQuantidadeGarcons(delta) {
  quantidadeAtual += delta;
  if (quantidadeAtual < 1) quantidadeAtual = 1;
  document.getElementById("quantidadeGarcons").value = quantidadeAtual;
  renderizarFormulariosGarcons();
}

function renderizarFormulariosGarcons() {
  const container = document.getElementById("formularioGarcons");

  // Salva dados preenchidos antes de apagar a tela
  const dadosAnteriores = {};
  container.querySelectorAll(".garcom-bloco").forEach((bloco, index) => {
    const id = index + 1;
    const nomeInput = bloco.querySelector(`#nomeGarcom${id}`);
    const telInput = bloco.querySelector(`#telefoneGarcom${id}`);

    if (nomeInput && telInput) {
      dadosAnteriores[id] = {
        nome: nomeInput.value,
        telefone: telInput.value
      };
    }
  });

  // Limpa o container antes de reconstruir
  container.innerHTML = "";

  // Recria todos os blocos com os dados salvos (se houver)
  for (let i = 1; i <= quantidadeAtual; i++) {
    const dados = dadosAnteriores[i] || { nome: "", telefone: "" };

    const bloco = document.createElement("div");
    bloco.className = "garcom-bloco";
    bloco.innerHTML = `
      <span class="garcom-id">${i}</span>
      <input type="text" placeholder="Nome do garçom ${i}" id="nomeGarcom${i}" value="${dados.nome}" />
      <input type="tel" placeholder="Telefone" id="telefoneGarcom${i}" value="${dados.telefone}" oninput="formatarTelefone(this)" />
      <button onclick="gerarQRCode(${i})">QRCode</button>
    `;

    container.appendChild(bloco);
  }
}


function gerarQRCode(id) {
  const nome = document.getElementById(`nomeGarcom${id}`).value;
  const telefone = document.getElementById(`telefoneGarcom${id}`).value;
  const conteudo = `Garçom ${id}: ${nome}, Tel: ${telefone}`;

  const qrCodeDiv = document.getElementById("qrcode");
  qrCodeDiv.innerHTML = "";

  new QRCode(qrCodeDiv, {
    text: conteudo,
    width: 200,
    height: 200,
  });

  document.getElementById("modalQRCode").style.display = "block";
}

function formatarTelefone(input) {
  let valor = input.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);

  if (valor.length <= 10) {
    input.value = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    input.value = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
}

document.getElementById("quantidadeGarcons").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    quantidadeAtual = parseInt(this.value) || 1;
    if (quantidadeAtual < 1) quantidadeAtual = 1;
    renderizarFormulariosGarcons();
  }
});

function fecharModal() {
  document.getElementById("modalQRCode").style.display = "none";
}
