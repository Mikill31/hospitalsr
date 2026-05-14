// Modal component

export function openModal(title, bodyHTML, footerHTML = '') {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" id="modal-close-btn">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
      ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
    </div>
  `;

  document.body.appendChild(overlay);
  if (window.lucide) lucide.createIcons();

  // Close on X button
  overlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return overlay;
}

export function closeModal() {
  const existing = document.getElementById('modal-overlay');
  if (existing) existing.remove();
}

export function confirmModal(title, message, onConfirm) {
  const body = `<p class="confirm-text">${message}</p>`;
  const footer = `
    <button class="btn btn-secondary" id="confirm-cancel">Cancelar</button>
    <button class="btn btn-danger" id="confirm-ok">Eliminar</button>
  `;
  const overlay = openModal(title, body, footer);

  overlay.querySelector('#confirm-cancel').addEventListener('click', closeModal);
  overlay.querySelector('#confirm-ok').addEventListener('click', async () => {
    closeModal();
    await onConfirm();
  });
}
