import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { memo, useEffect } from 'react';
import useLinkLoader, { validateSearch } from '../ui/router/linkLoader';
import PuzzleEditor from '../ui/editor/PuzzleEditor';
import { Compressor } from '../data/serializer/compressor/allCompressors';
import { Serializer } from '../data/serializer/allSerializers';
import { GridConsumer } from '../ui/GridContext';
import EmbedContext, { useEmbed } from '../ui/EmbedContext';

function EmbedLoader() {
  const { setFeatures } = useEmbed();
  const params = useSearch({ from: '/edit-embed' });
  useEffect(() => {
    console.log(params);
    setFeatures({
      instructions: params.instructions,
      metadata: params.metadata,
    });
  }, [params, setFeatures]);
  return null;
}

export const Route = createFileRoute('/edit-embed')({
  validateSearch: (search: Record<string, unknown>) => ({
    ...validateSearch(search),
    nest: search.nest ? Number(search.nest) : undefined,
    callback: search.callback ? String(search.callback) : undefined,
    instructions: search.instructions ? search.instructions === 'true' : true,
    metadata: search.metadata ? search.metadata === 'true' : true,
  }),
  component: memo(function CreateMode() {
    const params = Route.useSearch();
    useLinkLoader(params, false, true);
    const navigate = useNavigate();

    return (
      <EmbedContext>
        <EmbedLoader />
        <PuzzleEditor>
          <GridConsumer>
            {({ grid, metadata, solution }) => {
              return (
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    if (params.callback) {
                      const callback = window.parent.gridConfigCallback.get(
                        params.callback
                      );
                      if (callback) {
                        callback(grid);
                      }
                    } else {
                      await navigate({
                        search: {
                          d: await Compressor.compress(
                            Serializer.stringifyPuzzle({
                              ...metadata,
                              grid,
                              solution,
                            })
                          ),
                        },
                      });
                    }
                  }}
                >
                  Save and exit
                </button>
              );
            }}
          </GridConsumer>
        </PuzzleEditor>
      </EmbedContext>
    );
  }),
});
