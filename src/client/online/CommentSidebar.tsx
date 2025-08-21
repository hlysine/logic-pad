import { memo, useId, useRef } from 'react';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery, queryClient } from './api';
import Loading from '../components/Loading';
import { FaChevronDown } from 'react-icons/fa';
import UserCard from '../metadata/UserCard';
import Markdown from '../components/Markdown';
import { IoSend } from 'react-icons/io5';
import { Comment, ListResponse } from './data';
import { useOnline } from '../contexts/OnlineContext';
import toast from 'react-hot-toast';

export interface CommentSidebarProps {
  open: boolean;
  onClose?: () => void;
}

export default memo(function CommentSidebar({
  open,
  onClose,
}: CommentSidebarProps) {
  const drawerId = useId();
  const { me } = useOnline();
  const { id } = useOnlinePuzzle();
  const commentList = useInfiniteQuery({
    ...bidirectionalInfiniteQuery(
      ['puzzle', id, 'comments'],
      (cursorBefore, cursorAfter) =>
        api.listComments(id!, cursorBefore, cursorAfter)
    ),
    enabled: !!id && !!me && open,
  });
  const addComment = useMutation({
    mutationFn: (variables: Parameters<typeof api.createComment>) => {
      return api.createComment(...variables);
    },
    onMutate: async (variables: Parameters<typeof api.createComment>) => {
      await queryClient.cancelQueries({
        queryKey: ['puzzle', id, 'comments'],
      });
      const previousComments = queryClient.getQueryData<
        InfiniteData<ListResponse<Comment>>
      >(['puzzle', id, 'comments'])!;
      const optimisticId = Math.random().toString(36).substring(2, 9);
      queryClient.setQueryData<InfiniteData<ListResponse<Comment>>>(
        ['puzzle', id, 'comments'],
        {
          pageParams: [undefined, ...previousComments.pageParams],
          pages: [
            {
              total: 1,
              results: [
                {
                  id: optimisticId,
                  content: variables[1],
                  puzzleId: id!,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  creator: me!,
                },
              ],
            },
            ...previousComments.pages,
          ],
        }
      );
      return { previousComments, optimisticId };
    },
    onError(error, _variables, context) {
      toast.error(error.message);
      if (context)
        queryClient.setQueryData<InfiniteData<ListResponse<Comment>>>(
          ['puzzle', id, 'comments'],
          oldData => {
            if (oldData === undefined) return undefined;
            return {
              ...oldData,
              pages: oldData.pages.map(page => {
                const results = page.results.filter(
                  comment => comment.id !== context.optimisticId
                );
                return {
                  total: results.length,
                  results,
                };
              }),
            };
          }
        );
    },
    onSuccess(data, _variables, context) {
      queryClient.setQueryData<InfiniteData<ListResponse<Comment>>>(
        ['puzzle', id, 'comments'],
        oldData => {
          if (oldData === undefined) return undefined;
          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              results: page.results.map(result =>
                result.id === context?.optimisticId
                  ? { ...result, id: data.id }
                  : result
              ),
            })),
          };
        }
      );
    },
    async onSettled() {
      await queryClient.invalidateQueries({
        queryKey: ['puzzle', id, 'comments'],
      });
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!id || !me) return null;

  return (
    <div className="drawer drawer-end h-0 w-0">
      <input
        id={`comment-sidebar-${drawerId}`}
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        readOnly
      />
      <div className="drawer-side !overflow-x-visible !overflow-y-visible z-50 h-full w-full">
        <label
          htmlFor={`comment-sidebar-${drawerId}`}
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={onClose}
        ></label>
        <div className="h-full w-full pointer-events-none flex justify-end">
          <div className="h-full w-[350px] max-w-full shrink-0 grow-0 flex flex-col items-center p-4 bg-neutral text-neutral-content self-stretch pointer-events-auto">
            <div className="text-accent text-sm uppercase self-start">
              Comments
            </div>
            <div className="divider" />
            {commentList.isPending ? (
              <Loading />
            ) : (
              <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden flex-1 [&>*]:shrink-0">
                {commentList.data?.pages.flatMap(page =>
                  page.results.map(comment => (
                    <>
                      <UserCard user={comment.creator} />
                      <Markdown>{comment.content}</Markdown>
                      <div className="divider m-0" />
                    </>
                  ))
                )}
                {commentList.isFetchingNextPage ? (
                  <Loading className="h-4 p-4" />
                ) : commentList.hasNextPage ? (
                  <button
                    className="btn btn-sm btn-neutral w-fit self-center"
                    onClick={async () => await commentList.fetchNextPage()}
                  >
                    Load more
                    <FaChevronDown />
                  </button>
                ) : null}
              </div>
            )}
            <div className="flex gap-2 items-center self-stretch">
              <textarea
                ref={textareaRef}
                placeholder="Add a comment..."
                maxLength={5000}
                className="textarea textarea-bordered flex-grow"
              />
              <button
                className="btn btn-ghost btn-square"
                onClick={() => {
                  if (!textareaRef.current?.value) return;
                  const content = textareaRef.current?.value;
                  if (content) {
                    addComment.mutate([id, content]);
                  }
                  textareaRef.current.value = '';
                }}
              >
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
