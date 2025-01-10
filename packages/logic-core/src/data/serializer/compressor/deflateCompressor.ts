import StreamCompressor from './streamCompressor.js';

export default class DeflateCompressor extends StreamCompressor {
  public get id(): string {
    return `dfl`;
  }

  protected get algorithm(): CompressionFormat {
    return 'deflate-raw';
  }

  public async compress(input: string): Promise<string> {
    const result = await super.compress(input);
    return result.replace(/\+/g, '-').replace(/\//g, '_');
  }

  public async decompress(input: string): Promise<string> {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    return await super.decompress(input);
  }
}
