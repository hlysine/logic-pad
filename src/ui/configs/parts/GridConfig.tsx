import { memo, useEffect, useRef, useState } from 'react';
import { ConfigType, GridConfig } from '../../../data/config';
import Instruction from '../../../data/instruction';
import GridData from '../../../data/grid';
import { FiExternalLink } from 'react-icons/fi';
import { useSearch } from '@tanstack/react-router';
import { Compressor } from '../../../data/serializer/compressor/allCompressors';
import { Serializer } from '../../../data/serializer/allSerializers';
import { cn } from '../../../utils';
import { uniqueId } from 'lodash';

export interface GridConfigProps {
  instruction: Instruction;
  config: GridConfig;
  setConfig?: (field: string, value: GridConfig['default']) => void;
}

declare global {
  interface Window {
    gridConfigCallback: Map<string, (grid: GridData) => void>;
  }
}

window.gridConfigCallback ??= new Map();

export default memo(function GridConfig({
  instruction,
  config,
  setConfig,
}: GridConfigProps) {
  const search = useSearch({
    strict: false,
  });
  const grid = instruction[
    config.field as keyof typeof instruction
  ] as unknown as GridData;
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const callbackId = useRef(uniqueId());

  useEffect(() => {
    const id = callbackId.current;
    window.gridConfigCallback.set(id, grid => {
      setConfig?.(config.field, grid);
      setOpen(false);
    });
    return () => {
      window.gridConfigCallback.delete(id);
    };
  }, [config.field, setConfig]);

  useEffect(() => {
    void (async () => {
      if (grid) {
        setUrl(
          '/edit-embed?nest=' +
            ('nest' in search ? (search.nest ?? 0) + 1 : 1).toString() +
            '&callback=' +
            callbackId.current +
            '&d=' +
            encodeURIComponent(
              await Compressor.compress(
                Serializer.stringifyPuzzle({
                  title: '',
                  author: '',
                  description: '',
                  link: '',
                  difficulty: 1,
                  grid,
                  solution: null,
                })
              )
            )
        );
      }
    })();
  }, [grid, search]);

  return (
    <div className="flex p-2 justify-between items-center">
      <span className="flex-1">{config.description}</span>
      <div className="flex flex-col gap-2">
        <button
          className="btn justify-start flex-nowrap flex"
          onClick={() => setOpen(true)}
        >
          Open editor
          <FiExternalLink size={24} />
        </button>
        <dialog id="my_modal_2" className={cn('modal', open && 'modal-open')}>
          <div className="modal-box w-[calc(100%-4rem)] h-full max-w-none bg-neutral">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </form>
            <iframe className="w-full h-full" src={url}></iframe>
          </div>
          <form method="dialog" className="modal-backdrop bg-neutral/55">
            <button onClick={() => setOpen(false)}>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
});

export const type = ConfigType.Grid;
