// Toast notification component
const icons = {
  success: 'check-circle-2',
  error: 'x-circle',
  warning: 'alert-triangle',
  info: 'info',
};

export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${icons[type]}" class="toast-icon"></i>
    <span class="toast-message">${message}</span>
    <i data-lucide="x" class="toast-close"></i>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  const close = toast.querySelector('.toast-close');
  const remove = () => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  };

  close.addEventListener('click', remove);
  setTimeout(remove, duration);
}
