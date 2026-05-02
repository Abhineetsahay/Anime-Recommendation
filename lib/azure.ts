import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const key = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;

const credential = new StorageSharedKeyCredential(account, key);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  credential,
);

export async function uploadToAzure(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });

  return blockBlobClient.url;
}

export async function deleteFromAzure(url: string): Promise<void> {
  const blobName = url.split("/").pop();
  if (!blobName) return;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
}
