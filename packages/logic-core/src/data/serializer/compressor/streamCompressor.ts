import CompressorBase from './compressorBase.js';

function ensureCompressionStream() {
  if (!globalThis.CompressionStream || !globalThis.DecompressionStream) {
    console.log('CompressionStream not supported. Loading polyfill.');
    return import('../../../polyfill/streamPolyfill.js');
  }
  return Promise.resolve();
}

export default abstract class StreamCompressor extends CompressorBase {
  protected abstract get algorithm(): CompressionFormat;

  /* eslint-disable @typescript-eslint/no-floating-promises */
  public async compress(input: string): Promise<string> {
    await ensureCompressionStream();
    const blobToBase64 = (blob: Blob): Promise<string> =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () =>
          resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });
    const byteArray = new TextEncoder().encode(input);
    const cs = new CompressionStream(this.algorithm);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).blob().then(blobToBase64);
  }

  public async decompress(input: string): Promise<string> {
    await ensureCompressionStream();
    const bytes = Uint8Array.from(atob(input), c => c.charCodeAt(0));
    const cs = new DecompressionStream(this.algorithm);
    const writer = cs.writable.getWriter();
    writer.write(bytes);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
      return new TextDecoder().decode(arrayBuffer);
    });
  }
}
