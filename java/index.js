document.addEventListener('DOMContentLoaded', () => {
  const abrirModal = document.getElementById("abrirModal");
  const fecharModal = document.getElementById("fecharModal");
  const modal = document.getElementById("modal");

  if (abrirModal && fecharModal && modal) {
    abrirModal.addEventListener("click", () => modal.classList.remove("hidden"));
    fecharModal.addEventListener("click", () => modal.classList.add("hidden"));

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }
});
