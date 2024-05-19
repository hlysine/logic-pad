import { Suspense, lazy, memo } from 'react';
import { type RemarkProps } from 'react-remark';
import { cn } from '../../utils';
import Loading from './Loading';

export interface MarkdownProps extends RemarkProps {
  className?: string;
}

const MarkdownAsync = lazy(async () => {
  const { Remark } = await import('react-remark');
  return {
    default: memo(function Markdown({
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
    }),
  };
});

export default memo(function Markdown(props: MarkdownProps) {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownAsync {...props} />
    </Suspense>
  );
});
