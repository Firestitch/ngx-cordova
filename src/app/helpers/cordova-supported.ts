export const cordovaSupported = document.location.port === '8080' ||
  (document.location.host === 'localhost' && !document.location.port) ||
  document.location.protocol === 'file:' ||
  document.location.protocol === 'ionic:' ||
  document.location.protocol === 'httpsionic:' ||
  document.location.protocol === 'capacitor:' ||
  document.location.protocol === 'app:';
