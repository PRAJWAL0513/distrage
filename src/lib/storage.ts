const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';
const PINATA_API = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

const PINATA_API_KEY = 'd5ed293e01d26ea4da43';
const PINATA_SECRET_KEY = '04cea5861c54f9075462816b9711e8f26f8b035ea776ce525b333fbc29fae556';

export async function storeFiles(files: File[]): Promise<string> {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));

    const response = await fetch(PINATA_API, {
      method: 'POST',
      body: formData,
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error storing files:', error);
    throw error;
  }
}

export async function retrieveFiles(cid: string): Promise<Response> {
  try {
    const response = await fetch(`${PINATA_GATEWAY}${cid}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve file');
    }
    return response;
  } catch (error) {
    console.error('Error retrieving files:', error);
    throw error;
  }
}