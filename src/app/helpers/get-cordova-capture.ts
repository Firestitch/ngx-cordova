export function getCordovaCapture() {
  const device = (<any>navigator).device;
  return device ? device.capture : null;
}
