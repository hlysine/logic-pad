export default abstract class CompressorBase {
  /**
   * The unique identifier for this compressor.
   */
  public abstract get id(): string;
  /**
   * Compress the given input string into URL-safe compressed string.
   * @param input The input string to compress.
   */
  public abstract compress(input: string): Promise<string>;
  /**
   * Decompress the given compressed string back into the original string.
   * @param input The compressed string to decompress.
   */
  public abstract decompress(input: string): Promise<string>;
}
