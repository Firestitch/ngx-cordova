import { getCordovaCapture } from './get-cordova-capture';
import { getCordovaResolveLocalFileSystemURL } from './get-cordova-resolve-local-file-system-url';

export function hasCordovaCaptureSupport() {
  return getCordovaCapture() && getCordovaResolveLocalFileSystemURL();
}
