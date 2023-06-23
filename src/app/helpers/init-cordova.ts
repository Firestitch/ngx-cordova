import { CordovaState } from '../enums';

import { cordovaSupported } from './cordova-supported';

export function initCordova() {
  window.addEventListener = function () {
    EventTarget.prototype.addEventListener.apply(this, arguments);
  };

  window.removeEventListener = function () {
    EventTarget.prototype.removeEventListener.apply(this, arguments);
  };

  document.addEventListener = function () {
    EventTarget.prototype.addEventListener.apply(this, arguments);
  };

  document.removeEventListener = function () {
    EventTarget.prototype.removeEventListener.apply(this, arguments);
  };

  if (cordovaSupported) {
    (window as any).cordovaState = CordovaState.Pending;
    const script = document.createElement('script');
    script.src = 'cordova.js';
    script.onload = () => {
      window.dispatchEvent(new CustomEvent('fsCordovaReady', {
        detail: {},
        bubbles: true,
        cancelable: true,
        composed: false,
      }));
    };

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);

    const base = document.getElementsByTagName('base')[0];
    base.setAttribute('href', '.');
  } else {
    (window as any).cordovaState = CordovaState.Unsupported;
  }
}