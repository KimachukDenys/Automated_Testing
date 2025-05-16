export function formatPrice(value) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value);
}

export function filterVisibleItems(items) {
  return items.filter(item => !item.hidden);
}

export function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function capitalizeProductName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}