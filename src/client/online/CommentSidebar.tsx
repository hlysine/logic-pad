import { memo, useId, useRef, useState } from 'react';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';
import { api, bidirectionalInfiniteQuery, queryClient } from './api';
import Loading from '../components/Loading';
import { FaCheck, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';
import UserCard from '../metadata/UserCard';
import Markdown from '../components/Markdown';
import { IoSend } from 'react-icons/io5';
import { Comment, ListResponse } from './data';
import { useOnline } from '../contexts/OnlineContext';
import toast from 'react-hot-toast';
import { toRelativeDate } from '../uiHelper';

export const CommentEntry = memo(function CommentEntry({
  comment,
}: {
  comment: Comment;
}) {
  const { me } = useOnline();
  const { id } = useOnlinePuzzle();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editable = !!me && me.id === comment.creator.id;

  const updateComment = useMutation({
    mutationKey: ['puzzle', id, 'comments', 'update'],
    mutationFn: (variables: Parameters<typeof api.updateComment>) => {
      return api.updateComment(...variables);
    },
    onMutate: async (variables: Parameters<typeof api.updateComment>) => {
      await queryClient.cancelQueries({
        queryKey: ['puzzle', id, 'comments'],
      });
      const previousContent = comment.content;
      queryClient.setQueryData<InfiniteData<ListResponse<Comment>>>(
        ['puzzle', id, 'comments'],
        oldData => {
          if (oldData === undefined) return undefined;
          return {
            ...oldData,
            pages: oldData.pages.map(page => {
              return {
                total: page.results.length,
                results: page.results.map(result =>
                  result.id === comment.id
                    ? { ...result, content: variables[1] }
                    : result
                ),
              };
            }),
          };
        }
      );
      return { previousContent };
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
                return {
                  total: page.results.length,
                  results: page.results.map(result =>
                    result.id === comment.id
                      ? { ...result, content: context.previousContent }
                      : result
                  ),
                };
              }),
            };
          }
        );
    },
    async onSettled() {
      if (
        queryClient.isMutating({
          mutationKey: ['puzzle', id, 'comments', 'update'],
        }) === 1
      )
        await queryClient.invalidateQueries({
          queryKey: ['puzzle', id, 'comments'],
        });
    },
  });
  const deleteComment = useMutation({
    mutationKey: ['puzzle', id, 'comments', 'delete'],
    mutationFn: (variables: Parameters<typeof api.deleteComment>) => {
      return api.deleteComment(...variables);
    },
    onMutate: async (variables: Parameters<typeof api.deleteComment>) => {
      await queryClient.cancelQueries({
        queryKey: ['puzzle', id, 'comments'],
      });
      const previousComments = queryClient.getQueryData<
        InfiniteData<ListResponse<Comment>>
      >(['puzzle', id, 'comments'])!;
      queryClient.setQueryData<InfiniteData<ListResponse<Comment>>>(
        ['puzzle', id, 'comments'],
        oldData => {
          if (oldData === undefined) return undefined;
          return {
            ...oldData,
            pages: oldData.pages.map(page => {
              return {
                total: page.results.length,
                results: page.results.filter(
                  result => result.id !== variables[0]
                ),
              };
            }),
          };
        }
      );
      return { previousComments };
    },
    onError(error, _variables, context) {
      toast.error(error.message);
      if (context)
        queryClient.setQueryData<InfiniteData<ListResponse<Comment>>>(
          ['puzzle', id, 'comments'],
          context.previousComments
        );
    },
    async onSettled() {
      if (
        queryClient.isMutating({
          mutationKey: ['puzzle', id, 'comments', 'delete'],
        }) === 1
      )
        await queryClient.invalidateQueries({
          queryKey: ['puzzle', id, 'comments'],
        });
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <UserCard user={comment.creator} className="!badge-sm !py-2" />
        <div className="text-sm opacity-80">
          {toRelativeDate(new Date(comment.createdAt))}
        </div>
      </div>
      {editable ? (
        <div className="self-stretch flex gap-1">
          {editing ? (
            <textarea
              ref={inputRef}
              className="textarea textarea-ghost flex-1"
              defaultValue={comment.content}
            />
          ) : (
            <Markdown className="flex-1 break-words">
              {comment.content}
            </Markdown>
          )}
          <button
            className="btn btn-ghost btn-sm shrink-0 px-2"
            onClick={() => {
              const content = inputRef.current?.value.trim() ?? comment.content;
              if (editing && content !== comment.content) {
                updateComment.mutate([comment.id, content]);
              }
              setEditing(!editing);
            }}
          >
            {editing ? <FaCheck /> : <FaEdit />}
          </button>
          <button
            className="btn btn-ghost btn-sm shrink-0 px-2 text-error"
            onClick={() => {
              deleteComment.mutate([comment.id]);
            }}
          >
            <FaTrash />
          </button>
        </div>
      ) : (
        <Markdown className="break-words">{comment.content}</Markdown>
      )}
      <div className="divider m-0 opacity-50" />
    </div>
  );
});

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
    mutationKey: ['puzzle', id, 'comments', 'add'],
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
      if (
        queryClient.isMutating({
          mutationKey: ['puzzle', id, 'comments', 'add'],
        }) === 1
      )
        await queryClient.invalidateQueries({
          queryKey: ['puzzle', id, 'comments'],
        });
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!id || !me) return null;

  const sendComment = () => {
    if (!textareaRef.current?.value) return;
    const content = textareaRef.current.value;
    if (content) {
      addComment.mutate([id, content]);
    }
    textareaRef.current.value = '';
  };

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
          <div className="h-full w-[350px] max-w-full shrink-0 grow-0 flex flex-col items-center pt-4 pb-2 gap-4 bg-neutral text-neutral-content self-stretch pointer-events-auto">
            <div className="text-accent text-sm uppercase self-start mx-4">
              Comments
            </div>
            {commentList.isPending ? (
              <Loading />
            ) : (
              <div className="self-stretch overflow-y-auto overflow-x-hidden flex-1 ms-2 scrollbar-stable">
                <div className="flex flex-col-reverse w-full">
                  {commentList.data?.pages.flatMap(page =>
                    page.results.map(comment => (
                      <CommentEntry key={comment.id} comment={comment} />
                    ))
                  )}
                  {commentList.isFetchingNextPage ? (
                    <Loading className="h-4 p-4 self-center" />
                  ) : commentList.hasNextPage ? (
                    <button
                      className="btn btn-sm btn-neutral w-fit self-center"
                      onClick={async () => await commentList.fetchNextPage()}
                    >
                      Load more
                      <FaChevronUp />
                    </button>
                  ) : null}
                </div>
              </div>
            )}
            <div className="flex gap-2 items-center self-stretch mx-2">
              <textarea
                ref={textareaRef}
                placeholder={
                  'Add a comment...\nUse ||double pipes|| for spoilers'
                }
                maxLength={5000}
                className="textarea textarea-bordered flex-grow"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendComment();
                  }
                }}
              />
              <button
                className="btn btn-ghost btn-square"
                onClick={sendComment}
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
