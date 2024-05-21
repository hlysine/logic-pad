import { Suspense, lazy, memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import Loading from './Loading';
import type { Options } from 'react-markdown';
import { spoilerPlugin } from 'remark-inline-spoiler';
import './markdown.css';

export interface MarkdownProps extends Readonly<Options> {
  className?: string;
  inline?: boolean;
  revealSpoiler?: boolean;
}

const MarkdownAsync = lazy(async () => {
  const { default: Markdown } = await import('react-markdown');

  const baseProps: Partial<MarkdownProps> = {
    remarkPlugins: [spoilerPlugin],
    remarkRehypeOptions: {
      handlers: {
        spoiler: (_: any, node: { value: string }) => {
          return {
            type: 'element',
            tagName: 'spoiler',
            properties: {},
            children: [
              {
                type: 'text',
                value: node.value,
              },
            ],
          };
        },
      },
    } as MarkdownProps['remarkRehypeOptions'],
  };

  const baseComponents: MarkdownProps['components'] = {
    spoiler: ({ children }: { children: any }) => {
      return (
        <MarkdownAsync className="spoiler" inline={true}>
          {children}
        </MarkdownAsync>
      );
    },
  } as MarkdownProps['components'];

  const inlineComponents: MarkdownProps['components'] = {
    ...baseComponents,
    p: 'span',
    div: 'span',
  };

  return {
    default: memo(function MarkdownAsync({
      className,
      inline,
      revealSpoiler,
      ...mdProps
    }: MarkdownProps) {
      inline = inline ?? false;
      return (
        <Markdown
          {...baseProps}
          components={inline ? inlineComponents : baseComponents}
          {...mdProps}
          className={cn(
            'markdown',
            className,
            revealSpoiler && 'spoiler-reveal'
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
