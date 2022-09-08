export const noScroll = document.addEventListener('wheel', function (event) {
  const numberInput = <HTMLInputElement>document.activeElement;
  if (numberInput.type === 'number') {
    numberInput.blur();
  }
});
