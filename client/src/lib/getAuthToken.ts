export function getAuthToken() {
  const auth = JSON.parse(localStorage.getItem('auth') || '{}');
  const token = auth.token;
  return token;
}
