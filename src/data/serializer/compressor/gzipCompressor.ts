import StreamCompressor from './streamCompressor';

export default class GzipCompressor extends StreamCompressor {
  public get id(): string {
    return `gzip`;
  }

  protected get algorithm(): CompressionFormat {
    return 'gzip';
  }
}
