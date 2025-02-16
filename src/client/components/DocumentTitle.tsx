import { memo } from 'react';

export interface DocumentTitleProps {
  children: string | string[];
}

export default memo(function DocumentTitle({ children }: DocumentTitleProps) {
  document.title = Array.isArray(children) ? children.join('') : children;
  return null;
});
