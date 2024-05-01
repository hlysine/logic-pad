import { memo, useEffect, useRef, useState } from 'react';
import { getInstruction, useConfig } from '../ConfigContext';
import Config from './parts/Config';
import Rule from '../../data/rules/rule';
import { useGrid } from '../GridContext';
import Symbol from '../../data/symbols/symbol';
import { useToolbox } from '../ToolboxContext';
import SupportLevel from '../components/SupportLevel';
import { mousePosition } from '../../utils';

const gap = 8;

function getPosition(
  targetRef: React.RefObject<HTMLElement>,
  boxRef: React.RefObject<HTMLElement>
) {
  let targetRect = targetRef.current?.getBoundingClientRect();
  let boxRect = boxRef.current?.getBoundingClientRect();
  const windowRect = document.documentElement.getBoundingClientRect();
  if (!targetRect || !boxRect) {
    boxRect = new DOMRect(0, 0, 400, 400);
    targetRect = new DOMRect(
      mousePosition.clientX - 30,
      mousePosition.clientY - 30,
      60,
      60
    );
  }
  const ret: { left: string; top: string } = {
    left: 'auto',
    top: 'auto',
  };
  const clampWidth = (width: number) =>
    Math.min(windowRect.width - boxRect.width, Math.max(0, width));
  const clampHeight = (height: number) =>
    Math.min(windowRect.height - boxRect.height, Math.max(0, height));
  if (windowRect.width < 1000) {
    if (targetRect.top > windowRect.height / 2) {
      ret.top = `${clampHeight(targetRect.top - boxRect.height - gap)}px`;
    } else {
      ret.top = `${clampHeight(targetRect.bottom + gap)}px`;
    }
    if (targetRect.left > windowRect.width / 2) {
      ret.left = `${clampWidth(targetRect.right - boxRect.width)}px`;
    } else {
      ret.left = `${clampWidth(Math.max(0, targetRect.left))}px`;
    }
  } else {
    if (targetRect.left > windowRect.width / 2) {
      ret.left = `${clampWidth(targetRect.left - boxRect.width - gap)}px`;
    } else {
      ret.left = `${clampWidth(targetRect.right + gap)}px`;
    }
    if (targetRect.top > windowRect.height / 2) {
      ret.top = `${clampHeight(targetRect.bottom - boxRect.height)}px`;
    } else {
      ret.top = `${clampHeight(targetRect.top)}px`;
    }
  }
  return ret;
}

export default memo(function ConfigPopup() {
  const { location, ref, setLocation, setRef } = useConfig();
  const { grid, setGrid } = useGrid();
  const { presets, setPresets } = useToolbox();

  const instruction = location ? getInstruction(grid, location) : undefined;

  useEffect(() => {
    if (!instruction) {
      setLocation(undefined);
      setRef(undefined);
    }
  }, [instruction, setLocation, setRef]);

  const popupRef = useRef<HTMLDivElement>(null);
  const popupLocation = useRef<{ left: string; top: string }>({
    left: '',
    top: '',
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !popupRef.current?.contains(e.target as Node) &&
        !ref?.current?.contains(e.target as Node)
      ) {
        setLocation(undefined);
        setRef(undefined);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [setLocation, setRef, ref]);

  useEffect(() => {
    const handler = () => {
      if (!ref?.current || !popupRef.current) return;
      const styles = getPosition(ref, popupRef);
      if (!styles) return;
      popupRef.current.style.left = styles.left;
      popupRef.current.style.top = styles.top;
      popupLocation.current = styles;
    };
    handler();
    window.addEventListener('resize', handler);
    document
      .querySelector('.overflow-y-auto')
      ?.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('resize', handler);
      document
        .querySelector('.overflow-y-auto')
        ?.removeEventListener('scroll', handler);
    };
  }, [ref, popupRef]);

  const [presetName, setPresetName] = useState('');

  if (!instruction || !ref) return null;

  const configs = instruction.configs?.filter(config => config.configurable);

  return (
    <div
      className="p-4 z-50 bg-base-300 text-base-content shadow-xl rounded-box w-[400px] fixed transition-all flex flex-col gap-2"
      ref={popupRef}
      style={popupLocation.current}
    >
      {configs && configs.length > 0 ? (
        configs.map(config => (
          <Config
            key={`${config.field}: ${config.type}`}
            instruction={instruction}
            config={config}
            setConfig={(field, value) => {
              if (instruction instanceof Rule) {
                const newInstruction = instruction.copyWith({
                  [field]: value,
                });
                setGrid(grid.replaceRule(instruction, newInstruction));
              } else if (instruction instanceof Symbol) {
                const newInstruction = instruction.copyWith({
                  [field]: value,
                });
                setGrid(grid.replaceSymbol(instruction, newInstruction));
              }
            }}
          />
        ))
      ) : (
        <span className="text-center">Not configurable</span>
      )}
      <div className="flex gap-2 self-stretch justify-between px-2">
        <SupportLevel validate={!instruction.validateWithSolution} />
        <div className="flex-1" />
        {instruction instanceof Symbol && (
          <div className="dropdown dropdown-top">
            <button tabIndex={0} className="btn btn-outline btn-info">
              Add to presets
            </button>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] p-2 shadow-lg bg-base-200 rounded-box w-72 flex gap-2 mb-2"
            >
              <input
                type="text"
                placeholder="Preset name"
                className="input input-bordered input-sm w-full"
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
              />
              <button
                className="btn btn-sm btn-outline btn-info"
                disabled={
                  !!presets.find(p => p.name === presetName) || !presetName
                }
                onClick={() => {
                  setPresets([
                    ...presets,
                    { name: presetName, symbol: instruction },
                  ]);
                  setPresetName('');
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}
        <button
          className="btn btn-outline btn-error"
          onClick={() => {
            if (instruction instanceof Rule) {
              setGrid(grid.removeRule(instruction));
              setLocation(undefined);
              setRef(undefined);
            } else if (instruction instanceof Symbol) {
              setGrid(grid.removeSymbol(instruction));
              setLocation(undefined);
              setRef(undefined);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
});
