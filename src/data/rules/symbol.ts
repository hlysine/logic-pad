import DataObject from './dataObject';

export default abstract class Symbol extends DataObject {
  public abstract copyWith(props: { [key: string]: any }): Symbol;
}
