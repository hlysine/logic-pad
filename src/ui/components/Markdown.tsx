import { memo } from 'react';
import { Remark, RemarkProps } from 'react-remark';
import { cn } from '../../utils';

export interface MarkdownProps extends RemarkProps {
  className?: string;
}

export default memo(function Markdown({
  className,
  ...remarkProps
}: MarkdownProps) {
  return (
    <div
      className={cn('[&_li]:list-disc [&_li]:ms-4 leading-normal', className)}
    >
      <Remark {...remarkProps} />
    </div>
  );
});
