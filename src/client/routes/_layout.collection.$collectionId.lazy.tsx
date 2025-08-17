import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { FaChevronDown, FaThList, FaTrash, FaUser } from 'react-icons/fa';
import {
  mutationOptions,
  useMutation,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import PuzzleCard from '../online/PuzzleCard';
import Loading from '../components/Loading';
import { useRouteProtection } from '../router/useRouteProtection';
import {
  collectionInfiniteQueryOptions,
  collectionQueryOptions,
} from './_layout.collection.$collectionId';
import UserCard from '../metadata/UserCard';
import { toRelativeDate } from '../uiHelper';
import CollectionFollowButton from '../online/CollectionFollowButton';
import { CollectionBrief, ResourceStatus } from '../online/data';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';
import { useOnline } from '../contexts/OnlineContext';
import EditableField from '../components/EditableField';

const updateCollectionOptions = (collectionId: string) =>
  mutationOptions({
    mutationFn: (variables: Parameters<typeof api.updateCollection>) => {
      return api.updateCollection(...variables);
    },
    onMutate: async (variables: Parameters<typeof api.updateCollection>) => {
      await queryClient.cancelQueries({
        queryKey: ['collection', collectionId],
      });
      const previousCollection = queryClient.getQueryData<CollectionBrief>([
        'collection',
        collectionId,
      ])!;
      queryClient.setQueryData(['collection', collectionId], {
        ...previousCollection,
        title: variables[1] ?? previousCollection.title,
        description: variables[2] ?? previousCollection.description,
        status: variables[3] ?? previousCollection.status,
      });
      return { previousCollection };
    },
    onError(error, _variables, context) {
      toast.error(error.message);
      if (context)
        queryClient.setQueryData(
          ['collection', collectionId],
          context.previousCollection
        );
    },
    onSettled(_data, _error) {
      void queryClient.invalidateQueries({
        queryKey: ['collection', collectionId],
      });
    },
  });

export const Route = createLazyFileRoute('/_layout/collection/$collectionId')({
  component: memo(function Collection() {
    useRouteProtection('online');
    const navigate = Route.useNavigate();
    const params = Route.useParams();
    const { me } = useOnline();
    const { data: collectionBrief } = useSuspenseQuery(
      collectionQueryOptions(params.collectionId)
    );
    const {
      data: puzzles,
      fetchNextPage,
      hasNextPage,
      isFetching,
    } = useSuspenseInfiniteQuery(
      collectionInfiniteQueryOptions(params.collectionId)
    );
    const updateCollection = useMutation(
      updateCollectionOptions(params.collectionId)
    );
    const deleteCollection = useMutation({
      mutationFn: (collectionId: string) => {
        return api.deleteCollection(collectionId);
      },
      onError(error) {
        toast.error(error.message);
      },
      async onSuccess() {
        await navigate({ to: '/my-stuff/collections' });
      },
    });

    return (
      <ResponsiveLayout>
        <div className="flex items-center text-3xl mt-8">
          <FaThList className="inline-block me-4 shrink-0" />
          <EditableField
            initialValue={collectionBrief.title}
            editable={collectionBrief.creator.id === me?.id}
            pending={updateCollection.isPending}
            onEdit={async newValue => {
              await updateCollection.mutateAsync([
                params.collectionId,
                newValue,
              ]);
            }}
          />
          <div className="flex-1" />
          {collectionBrief.creator.id === me?.id && (
            <div className="flex gap-4 justify-end items-center bg-base-100 rounded-lg overflow-hidden ps-2 shrink-0">
              <div className="form-control me-2">
                <label className="label cursor-pointer flex gap-2">
                  <span className="label-text">Public collection</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={collectionBrief.status === ResourceStatus.Public}
                    onChange={async e => {
                      await updateCollection.mutateAsync([
                        params.collectionId,
                        undefined,
                        undefined,
                        e.target.checked
                          ? ResourceStatus.Public
                          : ResourceStatus.Private,
                      ]);
                    }}
                  />
                </label>
              </div>
              {collectionBrief.autoPopulate === null && (
                <button
                  className="tooltip tooltip-error tooltip-left btn btn-error rounded-none"
                  data-tip="Delete this collection"
                  onClick={() =>
                    (
                      document.getElementById(
                        'deleteCollectionModal'
                      ) as HTMLDialogElement
                    ).showModal()
                  }
                >
                  <FaTrash />
                </button>
              )}
              <dialog id="deleteCollectionModal" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-xl">
                    Are you sure you want to delete this collection?
                  </h3>
                  {deleteCollection.isPending ? (
                    <div className="modal-action">
                      <Loading />
                    </div>
                  ) : (
                    <div className="modal-action">
                      <button
                        className="btn"
                        onClick={() =>
                          (
                            document.getElementById(
                              'deleteCollectionModal'
                            ) as HTMLDialogElement
                          ).close()
                        }
                      >
                        No
                      </button>
                      <button
                        className="btn btn-error"
                        onClick={async () => {
                          await deleteCollection.mutateAsync(
                            params.collectionId
                          );
                        }}
                      >
                        Yes
                      </button>
                    </div>
                  )}
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          )}
        </div>
        <UserCard user={collectionBrief.creator} />
        <div className="flex gap-4 items-center">
          <span className="badge badge-ghost badge-lg p-4 bg-base-100 text-base-content border-0">
            <FaUser className="inline-block me-2" />
            {collectionBrief.followCount} follows
          </span>
          <span className="opacity-80">
            Created {toRelativeDate(new Date(collectionBrief.createdAt))}
          </span>
          <span className="opacity-80">
            Updated {toRelativeDate(new Date(collectionBrief.updatedAt))}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <EditableField
            className="flex-1"
            initialValue={collectionBrief.description}
            editable={collectionBrief.creator.id === me?.id}
            pending={updateCollection.isPending}
            onEdit={async newValue => {
              await updateCollection.mutateAsync([
                params.collectionId,
                undefined,
                newValue,
              ]);
            }}
          />
          {collectionBrief.status === ResourceStatus.Public ? (
            <CollectionFollowButton collectionId={collectionBrief.id} />
          ) : (
            <div className="btn btn-disabled">Private collection</div>
          )}
        </div>
        <div className="divider" />
        <div className="flex flex-col gap-4 items-center">
          {puzzles && puzzles.pages.length > 0 && (
            <div className="w-full">{puzzles.pages[0].total} puzzles</div>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            {puzzles?.pages.flatMap(page =>
              page.results.map(puzzle => (
                <PuzzleCard
                  key={puzzle.id}
                  puzzle={puzzle}
                  onClick={async () => {
                    await navigate({
                      to: `/solve/${puzzle.id}`,
                    });
                  }}
                />
              ))
            )}
          </div>
          {isFetching ? (
            <Loading />
          ) : hasNextPage ? (
            <button className="btn" onClick={async () => await fetchNextPage()}>
              Load more
              <FaChevronDown />
            </button>
          ) : null}
        </div>
      </ResponsiveLayout>
    );
  }),
});
