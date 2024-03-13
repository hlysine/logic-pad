import GridData from './grid';

export default abstract class Instruction {
  public abstract get id(): string;

  public get acryonym(): string {
    return this.id
      .split('_')
      .map(word => word[0])
      .join('');
  }

  public abstract get explanation(): string;

  public abstract get exampleGrid(): GridData;

  public abstract copyWith(props: { [key: string]: any }): this;
}
