// Dynamically assign base URL so cypress can leverage proxy
export const getBaseUrl = () => {
  if (window.location.hostname === 'localhost' && window.location.port === '8000') {
    return '/'
  } else if (window.location.hostname === 'saythenumber.onrender.com') {
    return '/'
  }
  return '/api'
}
