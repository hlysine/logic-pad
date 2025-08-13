import { createLazyFileRoute, UseNavigateResult } from '@tanstack/react-router';
import { Fragment, memo, useEffect, useMemo, useRef } from 'react';
import TopBottomLayout from '../components/TopBottomLayout';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { SearchParams } from './_layout.search';
import debounce from 'lodash/debounce';
import SearchResults from '../online/SearchResults';

type FilterOption = {
  id: string;
  text: string | React.ReactElement;
  onClick: (
    search: SearchParams,
    navigate: UseNavigateResult<'/search'>
  ) => Promise<void>;
  isActive: (search: SearchParams) => boolean;
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
        id: 'logic',
        text: 'Logic',
        onClick: async (search, navigate) => {
          const newValue = search.type === 'logic' ? undefined : 'logic';
          await navigate({ search: { ...search, type: newValue } });
        },
        isActive: search => search.type === 'logic',
      },
      {
        id: 'underclued',
        text: 'Underclued',
        onClick: async (search, navigate) => {
          const newValue =
            search.type === 'underclued' ? undefined : 'underclued';
          await navigate({ search: { ...search, type: newValue } });
        },
        isActive: search => search.type === 'underclued',
      },
      {
        id: 'pattern',
        text: 'Pattern',
        onClick: async (search, navigate) => {
          const newValue = search.type === 'pattern' ? undefined : 'pattern';
          await navigate({ search: { ...search, type: newValue } });
        },
        isActive: search => search.type === 'pattern',
      },
      {
        id: 'music',
        text: 'Music',
        onClick: async (search, navigate) => {
          const newValue = search.type === 'music' ? undefined : 'music';
          await navigate({ search: { ...search, type: newValue } });
        },
        isActive: search => search.type === 'music',
      },
    ],
  },
  {
    name: 'Size',
    options: [
      {
        id: 's',
        text: 'Small',
        onClick: async (search, navigate) => {
          const newValue = search.size === 's' ? undefined : 's';
          await navigate({ search: { ...search, size: newValue } });
        },
        isActive: search => search.size === 's',
      },
      {
        id: 'm',
        text: 'Medium',
        onClick: async (search, navigate) => {
          const newValue = search.size === 'm' ? undefined : 'm';
          await navigate({ search: { ...search, size: newValue } });
        },
        isActive: search => search.size === 'm',
      },
      {
        id: 'l',
        text: 'Large',
        onClick: async (search, navigate) => {
          const newValue = search.size === 'l' ? undefined : 'l';
          await navigate({ search: { ...search, size: newValue } });
        },
        isActive: search => search.size === 'l',
      },
    ],
  },
  {
    name: 'Difficulty',
    options: [
      {
        id: '1-4',
        text: (
          <>
            1 <span className="w-4 h-4 bg-accent mask mask-circle" /> - 4{' '}
            <span className="w-4 h-4 bg-accent mask mask-circle" />
          </>
        ),
        onClick: async (search, navigate) => {
          if (search.minDiff !== 1 || search.maxDiff !== 4) {
            await navigate({ search: { ...search, minDiff: 1, maxDiff: 4 } });
          } else {
            await navigate({
              search: { ...search, minDiff: undefined, maxDiff: undefined },
            });
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
        onClick: async (search, navigate) => {
          if (search.minDiff !== 5 || search.maxDiff !== 7) {
            await navigate({ search: { ...search, minDiff: 5, maxDiff: 7 } });
          } else {
            await navigate({
              search: { ...search, minDiff: undefined, maxDiff: undefined },
            });
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
        onClick: async (search, navigate) => {
          if (search.minDiff !== 8 || search.maxDiff !== 10) {
            await navigate({ search: { ...search, minDiff: 8, maxDiff: 10 } });
          } else {
            await navigate({
              search: { ...search, minDiff: undefined, maxDiff: undefined },
            });
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

export const Route = createLazyFileRoute('/_layout/search')({
  component: memo(function Home() {
    const navigate = Route.useNavigate();
    const search = Route.useSearch();

    const applyQuery = useMemo(
      () =>
        debounce(
          async (query: string) => {
            await navigate({ search: { ...search, q: query } });
          },
          100,
          { trailing: true }
        ),
      [navigate, search]
    );

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.value = search.q ?? '';
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <TopBottomLayout
        top={
          <>
            <div className="text-3xl mt-8">Search</div>
            <div role="tablist" className="tabs tabs-lg tabs-bordered">
              <a role="tab" className="tab tab-active">
                Puzzles
              </a>
              <a role="tab" className="tab opacity-50">
                Collections
              </a>
            </div>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <FaSearch />
              <input
                ref={inputRef}
                type="text"
                className="grow"
                placeholder="Enter search terms"
                onChange={e => applyQuery(e.target.value)}
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
                        className={`btn btn-sm ${option.isActive(search) ? '' : 'btn-ghost'}`}
                        onClick={() => option.onClick(search, navigate)}
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
                    className={`btn btn-sm ${search.sort?.startsWith(`${ordering.id}-`) ? '' : 'btn-ghost'}`}
                    onClick={async () => {
                      if (search.sort === `${ordering.id}-asc`) {
                        await navigate({
                          search: { ...search, sort: `${ordering.id}-desc` },
                        });
                      } else if (search.sort === `${ordering.id}-desc`) {
                        await navigate({
                          search: { ...search, sort: undefined },
                        });
                      } else {
                        await navigate({
                          search: { ...search, sort: `${ordering.id}-asc` },
                        });
                      }
                    }}
                  >
                    {ordering.text}
                    {search.sort?.startsWith(`${ordering.id}-`) &&
                      (search.sort.endsWith('-asc') ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      ))}
                  </button>
                ))}
              </div>
            </div>
          </>
        }
      >
        <SearchResults params={search} />
      </TopBottomLayout>
    );
  }),
});
