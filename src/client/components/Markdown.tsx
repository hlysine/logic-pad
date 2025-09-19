import { Suspense, lazy, memo, useMemo, useState } from 'react';
import { cn } from '../../client/uiHelper.ts';
import Loading from './Loading';
import type { Options } from 'react-markdown';
import { spoilerPlugin } from 'remark-inline-spoiler';
import './markdown.css';
import { useOnline } from '../contexts/OnlineContext.tsx';

export interface MarkdownProps extends Readonly<Options> {
  className?: string;
  inline?: boolean;
  onClick?: React.MouseEventHandler;
  onClickCapture?: React.MouseEventHandler;
}

const profileUrlRegex = /^\/profile\/([^/\s]+)\/?$/;

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
          className={cn(
            'spoiler',
            revealSpoilers && 'spoiler-reveal !cursor-default'
          )}
          inline={true}
          onClickCapture={e => {
            if (revealSpoilers) return;
            e.preventDefault();
            e.stopPropagation();
            setRevealSpoilers(true);
          }}
        >
          {children}
        </MarkdownAsync>
      );
    },
    a: function Link({ href, children }: { href?: string; children: any }) {
      if (href?.startsWith('/profile/') && String(children).startsWith('@')) {
        const { isOnline, me } = useOnline();
        const isMe = useMemo(
          () => isOnline && me && profileUrlRegex.exec(href)?.[1] === me.id,
          [isOnline, me, href]
        );
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'bg-accent/10 border-b border-accent rounded-lg !no-underline',
              isMe
                ? 'bg-accent text-accent-content'
                : 'bg-accent/10 text-neutral-content'
            )}
          >
            {children}
          </a>
        );
      }
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
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
      onClickCapture,
      ...mdProps
    }: MarkdownProps) {
      inline = inline ?? false;
      if (inline) {
        return (
          <span
            className={cn(
              'markdown',
              className,
              (onClick || onClickCapture) && 'cursor-pointer'
            )}
            onClick={onClick}
            onClickCapture={onClickCapture}
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
            className={cn(
              'markdown',
              className,
              (onClick || onClickCapture) && 'cursor-pointer'
            )}
            onClick={onClick}
            onClickCapture={onClickCapture}
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
