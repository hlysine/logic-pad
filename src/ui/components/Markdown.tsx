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
      className={cn(
        '[&_li]:list-disc [&_li]:ms-5 leading-normal [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2',
        className
      )}
    >
      <Remark {...remarkProps} />
    </div>
  );
});
