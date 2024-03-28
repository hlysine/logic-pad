import { minBy } from '../../helper';
import CompressorBase from './compressorBase';
import GzipCompressor from './gzipCompressor';

const allCompressors = new Map<string, CompressorBase>();

function register<T extends CompressorBase>(prototype: T) {
  allCompressors.set(prototype.id, prototype);
}

register(new GzipCompressor());

class MasterCompressor extends CompressorBase {
  public get id(): string {
    return `compressor`;
  }

  public async compress(input: string): Promise<string> {
    const compressed = await Promise.all(
      [...allCompressors.values()].map(
        async compressor =>
          `${compressor.id}_${await compressor.compress(input)}`
      )
    );
    return minBy(compressed, c => c.length) ?? '';
  }

  public async decompress(input: string): Promise<string> {
    let [compressorId, compressed] = input.split('_', 2);
    if (!allCompressors.has(compressorId)) {
      compressorId = 'gzip';
      compressed = input;
    }
    const compressor = allCompressors.get(compressorId)!;
    return compressor.decompress(compressed);
  }
}

const Compressor = new MasterCompressor();
export default Compressor;
