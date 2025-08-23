import SerializerChecksum from '../serializer_checksum.js';
import CompressorBase from './compressorBase.js';

const checksumSerializer = new SerializerChecksum();
const encoder = new TextEncoder();

export default class ChecksumCompressor extends CompressorBase {
  public get id(): string {
    return `cs${checksumSerializer.version}`;
  }

  public async compress(input: string): Promise<string> {
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  public decompress(_input: string): Promise<string> {
    throw new Error('Checksum decompression is not supported');
  }
}
