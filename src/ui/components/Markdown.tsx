import { Suspense, lazy, memo } from 'react';
import { cn } from '../../utils';
import Loading from './Loading';
import type { Options } from 'react-markdown';

export interface MarkdownProps extends Readonly<Options> {
  className?: string;
}

const MarkdownAsync = lazy(async () => {
  const { default: Markdown } = await import('react-markdown');
  return {
    default: memo(function MarkdownAsync({
      className,
      ...mdProps
    }: MarkdownProps) {
      return (
        <Markdown
          {...mdProps}
          className={cn(
            '[&_li]:list-disc [&_li]:ms-5 leading-normal [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2',
            className
          )}
        />
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
