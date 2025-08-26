import { memo } from 'react';

export interface AnnotatedTextProps {
  children: string;
  className?: string;
}

export default memo(function AnnotatedText({
  children,
  className,
}: AnnotatedTextProps) {
  const parts = children.split('*');
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <span key={i} className="text-accent font-bold">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
});
