export default abstract class CompressorBase {
  public abstract get id(): string;
  public abstract compress(input: string): Promise<string>;
  public abstract decompress(input: string): Promise<string>;
}
