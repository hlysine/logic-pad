import DataObject from './dataObject';

export default abstract class Symbol extends DataObject {
  public abstract copyWith({ number }: { number?: number }): Symbol;
}
