export const INR = (n) => {
  const num = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const INRk = (n) => {
  const num = Number.isFinite(n) ? n : 0;
  if (Math.abs(num) >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (Math.abs(num) >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (Math.abs(num) >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${Math.round(num)}`;
};

export const num = (n, d = 0) => {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  }).format(v);
};

export const pct = (n, d = 1) => `${num(n, d)}%`;

export const monthLabel = (m) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (m == null) return '';
  const idx = (m - 1) % 12;
  const year = Math.floor((m - 1) / 12) + 1;
  return year > 1 ? `${months[idx]} Y${year}` : months[idx];
};

export const classForChange = (n) => {
  if (n > 0) return 'text-success';
  if (n < 0) return 'text-danger';
  return 'text-ink-secondary';
};

export const sign = (n) => (n > 0 ? '+' : '');
