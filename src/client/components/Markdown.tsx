import { Suspense, lazy, memo, useState } from 'react';
import { cn } from '../../client/uiHelper.ts';
import Loading from './Loading';
import type { Options } from 'react-markdown';
import { spoilerPlugin } from 'remark-inline-spoiler';
import './markdown.css';

export interface MarkdownProps extends Readonly<Options> {
  className?: string;
  inline?: boolean;
  onClick?: () => void;
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
    spoiler: function Spoiler({ children }: { children: any }) {
      const [revealSpoilers, setRevealSpoilers] = useState(false);
      return (
        <MarkdownAsync
          className={cn('spoiler', revealSpoilers && 'spoiler-reveal')}
          inline={true}
          onClick={() => setRevealSpoilers(true)}
        >
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
      onClick,
      ...mdProps
    }: MarkdownProps) {
      inline = inline ?? false;
      if (inline) {
        return (
          <span
            className={cn('markdown', className, onClick && 'cursor-pointer')}
            onClick={onClick}
          >
            <Markdown
              {...baseProps}
              components={inline ? inlineComponents : baseComponents}
              {...mdProps}
            />
          </span>
        );
      } else {
        return (
          <div
            className={cn('markdown', className, onClick && 'cursor-pointer')}
            onClick={onClick}
          >
            <Markdown
              {...baseProps}
              components={inline ? inlineComponents : baseComponents}
              {...mdProps}
            />
          </div>
        );
      }
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
