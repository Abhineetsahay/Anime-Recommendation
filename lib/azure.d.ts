declare module "@/lib/azure" {
  export function uploadToAzure(
    buffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string>;
  export function deleteFromAzure(url: string): Promise<void>;
}
