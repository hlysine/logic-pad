import { useInfiniteQuery } from '@tanstack/react-query';
import { memo } from 'react';
import Loading from '../../components/Loading';
import InfiniteScrollTrigger from '../../components/InfiniteScrollTrigger';
import { ModComment } from '../data';
import { FaReply } from 'react-icons/fa';
import { count, toRelativeDate } from '../../uiHelper';
import Skeleton from '../../components/Skeleton';
import { api, bidirectionalInfiniteQuery } from '../api';
import Markdown from '../../components/Markdown';

const UserComment = memo(function UserComment({
  comment,
}: {
  comment: ModComment;
}) {
  return (
    <div className="flex flex-col items-start self-stretch gap-1 shrink-0">
      <h3 className="flex items-center gap-2 text-xs opacity-80">
        <FaReply size={10} />
        <span>{comment.puzzle.title}</span>
      </h3>
      <div className="text-xs opacity-80 flex flex-wrap gap-2">
        <span>Created {toRelativeDate(new Date(comment.createdAt))}</span>
        <span>Updated {toRelativeDate(new Date(comment.updatedAt))}</span>
      </div>
      <Markdown className="break-words text-sm">{comment.content}</Markdown>
      <div className="divider my-0" />
    </div>
  );
});

export const modUserCommentsInfiniteQueryOptions = (userId: string) =>
  bidirectionalInfiniteQuery(
    ['profile', userId, 'mod-comments'],
    (cursorBefore, cursorAfter) =>
      api.modListComments(userId, cursorBefore, cursorAfter)
  );

export interface UserCommentsProps {
  userId: string;
}

export default memo(function UserComments({ userId }: UserCommentsProps) {
  const { data, isPending, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery(modUserCommentsInfiniteQueryOptions(userId));

  return (
    <div className="flex flex-col gap-4 w-[400px] max-w-full shrink-0">
      <h2 className="font-semibold text-xl shrink-0">
        Comments{' '}
        {data?.pages[0] && (
          <span className="badge badge-neutral">
            {count(data?.pages[0]?.total)}
          </span>
        )}
      </h2>
      <div className="flex-1 overflow-y-auto infinte-scroll">
        {isPending ? (
          <div className="flex flex-col gap-4 items-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="flex flex-col gap-2 w-full items-stretch" key={i}>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-12" />
                <div className="divider my-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            {data?.pages.flatMap(page =>
              page.results.map(collection => (
                <UserComment key={collection.id} comment={collection} />
              ))
            )}
            {isFetching ? (
              <Loading className="h-fit" />
            ) : hasNextPage ? (
              <InfiniteScrollTrigger
                onLoadMore={async () => await fetchNextPage()}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});
