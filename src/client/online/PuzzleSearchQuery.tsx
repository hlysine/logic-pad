import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { FaSearch, FaChevronUp, FaChevronDown } from 'react-icons/fa';

import z from 'zod';

export const puzzleSearchSchema = z.object({
  q: z.string().optional(),
  type: z.enum(['logic', 'underclued', 'pattern', 'music']).optional(),
  size: z.enum(['s', 'm', 'l']).optional(),
  minDiff: z.number().min(1).max(10).optional(),
  maxDiff: z.number().min(1).max(10).optional(),
  sort: z.string().optional(),
});

export type PuzzleSearchParams = z.infer<typeof puzzleSearchSchema>;

type FilterOption = {
  id: string;
  text: string | React.ReactElement;
  applyFilter: (search: PuzzleSearchParams) => PuzzleSearchParams;
  isActive: (search: PuzzleSearchParams) => boolean;
};

type Filter = {
  name: string;
  options: FilterOption[];
};

const filters: Filter[] = [
  {
    name: 'Type',
    options: [
      {
        id: 'any',
        text: 'Any',
        applyFilter: search => {
          return { ...search, type: undefined };
        },
        isActive: search => !search.type,
      },
      {
        id: 'logic',
        text: 'Logic',
        applyFilter: search => {
          const newValue = search.type === 'logic' ? undefined : 'logic';
          return { ...search, type: newValue };
        },
        isActive: search => search.type === 'logic',
      },
      {
        id: 'underclued',
        text: 'Underclued',
        applyFilter: search => {
          const newValue =
            search.type === 'underclued' ? undefined : 'underclued';
          return { ...search, type: newValue };
        },
        isActive: search => search.type === 'underclued',
      },
      {
        id: 'pattern',
        text: 'Pattern',
        applyFilter: search => {
          const newValue = search.type === 'pattern' ? undefined : 'pattern';
          return { ...search, type: newValue };
        },
        isActive: search => search.type === 'pattern',
      },
      {
        id: 'music',
        text: 'Music',
        applyFilter: search => {
          const newValue = search.type === 'music' ? undefined : 'music';
          return { ...search, type: newValue };
        },
        isActive: search => search.type === 'music',
      },
    ],
  },
  {
    name: 'Size',
    options: [
      {
        id: 'any',
        text: 'Any',
        applyFilter: search => {
          return { ...search, size: undefined };
        },
        isActive: search => !search.size,
      },
      {
        id: 's',
        text: 'Small',
        applyFilter: search => {
          const newValue = search.size === 's' ? undefined : 's';
          return { ...search, size: newValue };
        },
        isActive: search => search.size === 's',
      },
      {
        id: 'm',
        text: 'Medium',
        applyFilter: search => {
          const newValue = search.size === 'm' ? undefined : 'm';
          return { ...search, size: newValue };
        },
        isActive: search => search.size === 'm',
      },
      {
        id: 'l',
        text: 'Large',
        applyFilter: search => {
          const newValue = search.size === 'l' ? undefined : 'l';
          return { ...search, size: newValue };
        },
        isActive: search => search.size === 'l',
      },
    ],
  },
  {
    name: 'Difficulty',
    options: [
      {
        id: 'any',
        text: 'Any',
        applyFilter: search => {
          return { ...search, minDiff: undefined, maxDiff: undefined };
        },
        isActive: search => !search.minDiff && !search.maxDiff,
      },
      {
        id: '1-4',
        text: (
          <>
            1 <span className="w-4 h-4 bg-accent mask mask-circle" /> - 4{' '}
            <span className="w-4 h-4 bg-accent mask mask-circle" />
          </>
        ),
        applyFilter: search => {
          if (search.minDiff !== 1 || search.maxDiff !== 4) {
            return { ...search, minDiff: 1, maxDiff: 4 };
          } else {
            return { ...search, minDiff: undefined, maxDiff: undefined };
          }
        },
        isActive: search => search.minDiff === 1 && search.maxDiff === 4,
      },
      {
        id: '5-7',
        text: (
          <>
            5 <span className="w-4 h-4 bg-accent mask mask-circle" /> - 7{' '}
            <span className="w-4 h-4 bg-accent mask mask-star-2 scale-105" />
          </>
        ),
        applyFilter: search => {
          if (search.minDiff !== 5 || search.maxDiff !== 7) {
            return { ...search, minDiff: 5, maxDiff: 7 };
          } else {
            return { ...search, minDiff: undefined, maxDiff: undefined };
          }
        },
        isActive: search => search.minDiff === 5 && search.maxDiff === 7,
      },
      {
        id: '8-10',
        text: (
          <>
            8 <span className="w-4 h-4 bg-accent mask mask-star-2 scale-105" />{' '}
            - 10{' '}
            <span className="w-4 h-4 bg-accent mask mask-star-2 scale-105" />
          </>
        ),
        applyFilter: search => {
          if (search.minDiff !== 8 || search.maxDiff !== 10) {
            return { ...search, minDiff: 8, maxDiff: 10 };
          } else {
            return { ...search, minDiff: undefined, maxDiff: undefined };
          }
        },
        isActive: search => search.minDiff === 8 && search.maxDiff === 10,
      },
    ],
  },
];

const orderings = [
  {
    id: 'published',
    text: 'Published Date',
  },
  {
    id: 'solve',
    text: 'Solve Count',
  },
  {
    id: 'love',
    text: 'Love Count',
  },
  {
    id: 'difficulty',
    text: 'Difficulty',
  },
];

export interface PuzzleSearchQueryProps {
  params: PuzzleSearchParams;
  onChange: (params: PuzzleSearchParams) => void;
}

export default memo(function PuzzleSearchQuery({
  params,
  onChange,
}: PuzzleSearchQueryProps) {
  const [displayParams, setDisplayParams] =
    useState<PuzzleSearchParams>(params);
  const updateParams = useMemo(() => {
    const debouncedUpdate = debounce(
      (newParams: PuzzleSearchParams) => {
        onChange(newParams);
      },
      500,
      { trailing: true }
    );
    return (newParams: PuzzleSearchParams) => {
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
        {filters.map(filter => (
          <Fragment key={filter.name}>
            <div>{filter.name}</div>
            <div className="flex gap-4 flex-wrap">
              {filter.options.map(option => (
                <button
                  key={option.id}
                  className={`btn btn-sm ${option.isActive(displayParams) ? '' : 'btn-ghost'}`}
                  onClick={() =>
                    updateParams(option.applyFilter(displayParams))
                  }
                >
                  {option.text}
                </button>
              ))}
            </div>
          </Fragment>
        ))}
        <div className="mt-4">Sort by</div>
        <div className="flex gap-4 mt-4 flex-wrap">
          {orderings.map(ordering => (
            <button
              key={ordering.id}
              className={`btn btn-sm ${displayParams.sort?.startsWith(`${ordering.id}-`) ? '' : 'btn-ghost'}`}
              onClick={() => {
                let newParams: PuzzleSearchParams;
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
