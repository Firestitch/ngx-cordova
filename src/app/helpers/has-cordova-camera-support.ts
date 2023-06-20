import { getCordovaCamera } from './get-cordova-camera';
import { getCordovaResolveLocalFileSystemURL } from './get-cordova-resolve-local-file-system-url';

export function hasCordovaCameraSupport() {
  return getCordovaCamera() && getCordovaResolveLocalFileSystemURL();
}
