export function trimAttachmentName(filename: string) {
  const indexOfChar = filename?.indexOf('-');
  const slicedFileName = filename?.slice(indexOfChar + 1);
  return slicedFileName;
}
