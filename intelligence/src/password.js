// Geração criptográfica de senha local. Não enviar para logs ou telemetria.
// O servidor Supabase Auth recebe apenas a senha no fluxo HTTPS updateUser;
// o banco armazena somente seu hash, nunca a senha em texto aberto.
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'; // 64 símbolos
export function generateStrongPassword(cryptoSource = globalThis.crypto, length = 28) {
  if (!cryptoSource || typeof cryptoSource.getRandomValues !== 'function') throw new Error('Gerador seguro indisponível.');
  if (!Number.isInteger(length) || length < 20 || length > 64) throw new Error('Comprimento de senha inválido.');
  for (let attempt = 0; attempt < 20; attempt++) {
    const bytes = new Uint8Array(length);
    cryptoSource.getRandomValues(bytes);
    const password = Array.from(bytes, v => CHARSET[v & 63]).join('');
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) &&
        /[0-9]/.test(password) && /[-_]/.test(password)) return password;
  }
  throw new Error('Não foi possível gerar uma senha válida com segurança.');
}
