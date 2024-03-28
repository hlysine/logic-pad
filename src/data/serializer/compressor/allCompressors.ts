import { minBy } from '../../helper';
import CompressorBase from './compressorBase';
import GzipCompressor from './gzipCompressor';
import DeflateCompressor from './deflateCompressor';

const allCompressors = new Map<string, CompressorBase>();

function register<T extends CompressorBase>(prototype: T) {
  allCompressors.set(prototype.id, prototype);
}

const activeCompressors = [new DeflateCompressor()];
activeCompressors.forEach(register);

register(new GzipCompressor());

class MasterCompressor extends CompressorBase {
  public get id(): string {
    return `compressor`;
  }

  public async compress(input: string): Promise<string> {
    const compressed = await Promise.all(
      activeCompressors.map(async compressor =>
        encodeURIComponent(
          `${compressor.id}_${await compressor.compress(input)}`
        )
      )
    );
    return minBy(compressed, c => c.length) ?? '';
  }

  public async decompress(input: string): Promise<string> {
    input = decodeURIComponent(input);
    const match = input.match(/^([^_]+?)_(.+)$/);
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
export default Compressor;
