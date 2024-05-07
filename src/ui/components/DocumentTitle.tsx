export interface DocumentTitleProps {
  children: string | string[];
}

export default function DocumentTitle({ children }: DocumentTitleProps) {
  document.title = Array.isArray(children) ? children.join('') : children;
  return null;
}
