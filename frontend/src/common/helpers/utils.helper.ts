export const triggerDownload = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download;
  document.body.appendChild(link);
  link.click();
  link?.parentNode?.removeChild(link);
};
