export default abstract class Markup {
  public abstract get id(): string;

  public abstract copyWith(props: { [key: string]: any }): Markup;
}
