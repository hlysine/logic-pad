import { memo, useImperativeHandle, useRef, useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { api } from './api';
import debounce from 'lodash/debounce';

export type CommentTextareaRef = {
  sendComment: () => void;
  prependMention: (userName: string, userId: string) => void;
  focus: () => void;
};

export interface CommentTextareaProps {
  ref?: React.Ref<CommentTextareaRef>;
  defaultValue?: string;
  onPostComment?: (comment: string) => void;
}

const debouncedUserAutocomplete = debounce(api.userAutocomplete, 500, {
  leading: true,
  trailing: true,
});

export default memo(function CommentTextarea({
  ref,
  defaultValue,
  onPostComment: onPostComment,
}: CommentTextareaProps) {
  const [content, setContent] = useState(defaultValue ?? '');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendComment = () => {
    if (content.length > 0) {
      onPostComment?.(content.trim());
    }
    setContent('');
  };
  useImperativeHandle(
    ref,
    () => ({
      sendComment,
      prependMention: (userName, userId) => {
        setContent(prev => {
          if (!prev.startsWith(`[@${userName}](/profile/${userId})`)) {
            return `[@${userName}](/profile/${userId}) ${prev}`;
          }
          return prev;
        });
      },
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    [content]
  );

  return (
    <div className="flex-grow bg-base-100 focus-within:outline focus-within:outline-1 rounded-lg p-2">
      <MentionsInput
        value={content}
        inputRef={inputRef}
        onChange={e => setContent(e.target.value)}
        placeholder={'Add a comment...\nUse ||double pipes|| for spoilers'}
        maxLength={5000}
        allowSpaceInQuery={true}
        forceSuggestionsAboveCursor={true}
        className="bg-base-100 text-base-content h-24 focus:[&_textarea]:outline-none"
        customSuggestionsContainer={children => (
          <div className="bg-base-300 text-base-content px-4">{children}</div>
        )}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendComment();
          }
        }}
      >
        <Mention
          trigger="@"
          displayTransform={(_id, display) => `@${display}`}
          className="bg-accent/10 text-transparent border-b border-accent rounded-lg"
          data={(query, callback) => {
            if (query.length === 0) {
              callback([]);
              return;
            }
            debouncedUserAutocomplete(query).then(users =>
              callback(
                users.map(u => ({
                  id: u.id,
                  display: u.name,
                }))
              )
            );
          }}
          markup="[@__display__](/profile/__id__)"
        />
      </MentionsInput>
    </div>
  );
});
