export function numPad(num) {
  if(!isNaN(num)) {
    return num.toString().padStart(2, '0');
  }
}
