import { minBy } from '../../dataHelper.js';
import CompressorBase from './compressorBase.js';
import GzipCompressor from './gzipCompressor.js';
import DeflateCompressor from './deflateCompressor.js';

const allCompressors = new Map<string, CompressorBase>();

function register(prototype: CompressorBase) {
  allCompressors.set(prototype.id, prototype);
}

const activeCompressors = [new DeflateCompressor()];
activeCompressors.forEach(register);

register(new GzipCompressor());

/**
 * The master compressor for compressing and decompressing strings.
 *
 * It compares the output of multiple compressors and selects the one with the smallest size (slow),
 * and selects the correct decompressor when decompressing.
 */
class MasterCompressor extends CompressorBase {
  public get id(): string {
    return `compressor`;
  }

  public async compress(input: string): Promise<string> {
    const compressed = await Promise.all(
      activeCompressors.map(
        async compressor =>
          `${compressor.id}_${await compressor.compress(input)}`
      )
    );
    return minBy(compressed, c => encodeURIComponent(c).length) ?? '';
  }

  public async decompress(input: string): Promise<string> {
    const match = /^([^_]+?)_(.+)$/.exec(input);
    let compressorId: string;
    let compressed: string;
    if (match) {
      compressorId = match[1];
      compressed = match[2];
    } else {
      compressorId = 'gzip';
      compressed = input;
    }
    const compressor = allCompressors.get(compressorId)!;
    return compressor.decompress(compressed);
  }
}

const Compressor = new MasterCompressor();
export { Compressor };
