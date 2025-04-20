export async function getSignedUrl(attachment: { fileUrl: string | null }) {
  // Use the cloud provider's SDK to generate a signed URL for real implementaiton
  if (!attachment.fileUrl) {
    throw new Error('File URL is null or undefined');
  }
  return `https://stubbed-cloud.com/${encodeURIComponent(attachment.fileUrl)}`;
}
