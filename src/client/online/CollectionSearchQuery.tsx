import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { FaSearch, FaChevronUp, FaChevronDown } from 'react-icons/fa';

import z from 'zod';

export const collectionSearchSchema = z.object({
  q: z.string().optional(),
  sort: z.string().optional(),
});

export type CollectionSearchParams = z.infer<typeof collectionSearchSchema>;

const orderings = [
  {
    id: 'created',
    text: 'Creation Date',
  },
  {
    id: 'updated',
    text: 'Update Date',
  },
  {
    id: 'follow',
    text: 'Follow Count',
  },
];

export interface CollectionSearchQueryProps {
  params: CollectionSearchParams;
  onChange: (params: CollectionSearchParams) => void;
}

export default memo(function CollectionSearchQuery({
  params,
  onChange,
}: CollectionSearchQueryProps) {
  const [displayParams, setDisplayParams] =
    useState<CollectionSearchParams>(params);
  const updateParams = useMemo(() => {
    const debouncedUpdate = debounce(
      (newParams: CollectionSearchParams) => {
        onChange(newParams);
      },
      500,
      { trailing: true }
    );
    return (newParams: CollectionSearchParams) => {
      setDisplayParams(newParams);
      debouncedUpdate(newParams);
    };
  }, [onChange]);

  useEffect(() => {
    setDisplayParams(params);
  }, [params]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = displayParams.q ?? '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <label className="input input-bordered flex items-center gap-2 w-full">
        <FaSearch />
        <input
          ref={inputRef}
          type="text"
          className="grow"
          placeholder="Enter search terms"
          onChange={e => updateParams({ ...displayParams, q: e.target.value })}
        />
      </label>
      <div className="grid grid-cols-[minmax(8rem,auto)_minmax(0,1fr)] items-start gap-y-2">
        <div className="mt-4">Sort by</div>
        <div className="flex gap-4 mt-4 flex-wrap">
          {orderings.map(ordering => (
            <button
              key={ordering.id}
              className={`btn btn-sm ${displayParams.sort?.startsWith(`${ordering.id}-`) ? '' : 'btn-ghost'}`}
              onClick={() => {
                let newParams: CollectionSearchParams;
                if (displayParams.sort === `${ordering.id}-asc`) {
                  newParams = { ...displayParams, sort: undefined };
                } else if (displayParams.sort === `${ordering.id}-desc`) {
                  newParams = { ...displayParams, sort: `${ordering.id}-asc` };
                } else {
                  newParams = { ...displayParams, sort: `${ordering.id}-desc` };
                }
                updateParams(newParams);
              }}
            >
              {ordering.text}
              {displayParams.sort?.startsWith(`${ordering.id}-`) &&
                (displayParams.sort.endsWith('-asc') ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                ))}
            </button>
          ))}
        </div>
      </div>
    </>
  );
});
