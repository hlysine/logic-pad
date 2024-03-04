import Markup from '../../data/markups/markup';
import Number from './Number';

export interface MarkupProps<T extends Markup> {
  size: number;
  textClass: string;
  markup: T;
}

const registry = new Map<string, (props: MarkupProps<any>) => JSX.Element>();
registry.set('number', Number);

export default function TileMarkup({
  size,
  textClass,
  markup,
}: MarkupProps<Markup>) {
  const Component = registry.get(markup.id);
  if (!Component) {
    throw new Error(`No component for markup: ${markup.id}`);
  }
  return <Component size={size} textClass={textClass} markup={markup} />;
}
