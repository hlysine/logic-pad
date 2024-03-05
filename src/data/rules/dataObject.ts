export default abstract class DataObject {
  public abstract get id(): string;

  public get acryonym(): string {
    return this.id
      .split('_')
      .map(word => word[0])
      .join('');
  }

  public abstract copyWith(props: { [key: string]: any }): DataObject;
}
