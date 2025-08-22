import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { memo, useRef, useState } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import {
  FaCheck,
  FaChevronDown,
  FaPlus,
  FaThList,
  FaTrash,
  FaUser,
} from 'react-icons/fa';
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
import { cn, toRelativeDate } from '../uiHelper';
import CollectionFollowButton from '../online/CollectionFollowButton';
import { CollectionBrief, ResourceStatus } from '../online/data';
import { api, queryClient } from '../online/api';
import toast from 'react-hot-toast';
import { useOnline } from '../contexts/OnlineContext';
import EditableField from '../components/EditableField';
import AddPuzzleModal from '../online/AddPuzzleModal';
import { BiSolidSelectMultiple } from 'react-icons/bi';

interface CollectionPuzzlesProps {
  collectionId: string;
  editable: boolean;
}

const CollectionPuzzles = memo(function CollectionPuzzles({
  collectionId,
  editable,
}: CollectionPuzzlesProps) {
  const navigate = useNavigate();
  const { me } = useOnline();
  const {
    data: puzzles,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useSuspenseInfiniteQuery(collectionInfiniteQueryOptions(collectionId));
  const addToCollection = useMutation({
    mutationFn: (variables: Parameters<typeof api.addToCollection>) => {
      return api.addToCollection(...variables);
    },
    onError(error) {
      toast.error(error.message);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['collection', collectionId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['collection', collectionId, 'puzzles'],
      });
    },
  });
  const removeFromCollection = useMutation({
    mutationFn: (variables: Parameters<typeof api.removeFromCollection>) => {
      return api.removeFromCollection(...variables);
    },
    onError(error) {
      toast.error(error.message);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['collection', collectionId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['collection', collectionId, 'puzzles'],
      });
    },
  });
  const addPuzzleModalRef = useRef<{ open: () => void }>(null);
  const [selectedPuzzles, setSelectedPuzzles] = useState<string[] | null>(null);
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4 items-center w-full justify-end">
        {editable && (
          <>
            {addToCollection.isPending ? (
              <Loading className="h-12 w-24" />
            ) : (
              <button
                className="btn"
                onClick={() => addPuzzleModalRef.current?.open()}
              >
                <FaPlus size={16} />
                Add puzzles
              </button>
            )}
            <AddPuzzleModal
              ref={addPuzzleModalRef}
              onSubmit={async puzzles => {
                await addToCollection.mutateAsync([collectionId, puzzles]);
              }}
            />
            <div className="divider divider-horizontal mx-0" />
            {removeFromCollection.isPending ? (
              <Loading className="h-12 w-24" />
            ) : selectedPuzzles === null ? (
              <button className="btn" onClick={() => setSelectedPuzzles([])}>
                <BiSolidSelectMultiple size={16} />
                Select puzzles
              </button>
            ) : (
              <>
                <button
                  className="btn"
                  onClick={() => setSelectedPuzzles(null)}
                >
                  Cancel
                </button>
                <button
                  className={cn(
                    'btn',
                    selectedPuzzles?.length > 0 ? 'btn-error' : 'btn-disabled'
                  )}
                  onClick={async () => {
                    if (selectedPuzzles.length > 0) {
                      await removeFromCollection.mutateAsync([
                        collectionId,
                        selectedPuzzles,
                      ]);
                    }
                    setSelectedPuzzles(null);
                  }}
                >
                  <FaTrash size={16} />
                  Delete puzzles
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {puzzles?.pages.flatMap(page =>
          page.results.map(puzzle => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              onClick={async () => {
                if (selectedPuzzles !== null) {
                  setSelectedPuzzles(selection => {
                    if (selection?.includes(puzzle.id)) {
                      return selection.filter(id => id !== puzzle.id);
                    }
                    return [...(selection ?? []), puzzle.id];
                  });
                } else {
                  await navigate({
                    to:
                      puzzle.status === ResourceStatus.Private &&
                      puzzle.creator.id === me?.id
                        ? `/create/${puzzle.id}`
                        : `/solve/${puzzle.id}`,
                    search: {
                      collection: collectionId,
                    },
                  });
                }
              }}
            >
              {selectedPuzzles !== null && (
                <div
                  className={cn(
                    'absolute bottom-0 right-0 w-10 h-10 flex justify-center items-center rounded-tl-xl rounded-br-xl',
                    selectedPuzzles.includes(puzzle.id)
                      ? 'bg-accent text-accent-content'
                      : 'bg-base-100 text-base-content'
                  )}
                >
                  {selectedPuzzles.includes(puzzle.id) ? (
                    <FaCheck size={24} />
                  ) : (
                    <FaPlus size={24} />
                  )}
                </div>
              )}
            </PuzzleCard>
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
  );
});

const updateCollectionOptions = (collectionId: string) =>
  mutationOptions({
    mutationKey: ['collection', collectionId, 'update'],
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
      if (
        queryClient.isMutating({
          mutationKey: ['collection', collectionId, 'update'],
        }) === 1
      )
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
        await queryClient.invalidateQueries({
          queryKey: ['user', 'me', 'collections', {}],
        });
        await navigate({ to: '/my-stuff/collections' });
      },
    });

    return (
      <ResponsiveLayout>
        <div className="flex items-center text-3xl mt-8 flex-wrap gap-4 justify-between">
          <div className="flex items-center">
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
          </div>
          {collectionBrief.creator.id === me?.id && (
            <div className="flex justify-end items-center bg-base-100 rounded-lg overflow-hidden ps-2 shrink-0">
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
        <div className="flex gap-4 items-center flex-wrap">
          {collectionBrief.status === ResourceStatus.Public && (
            <span className="badge badge-ghost badge-lg p-4 bg-base-100 text-base-content border-0">
              <FaUser className="inline-block me-2" />
              {collectionBrief.followCount} follows
            </span>
          )}
          <span className="opacity-80">
            Created {toRelativeDate(new Date(collectionBrief.createdAt))}
          </span>
          <span className="opacity-80">
            Updated {toRelativeDate(new Date(collectionBrief.modifiedAt))}
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
        <CollectionPuzzles
          collectionId={params.collectionId}
          editable={
            collectionBrief.creator.id === me?.id &&
            collectionBrief.autoPopulate === null
          }
        />
      </ResponsiveLayout>
    );
  }),
});
