import { memo } from 'react';

export interface AnnotatedTextProps {
  text: string;
}

export default memo(function AnnotatedText({ text }: AnnotatedTextProps) {
  const parts = text.split('*');
  return (
    <span>
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
