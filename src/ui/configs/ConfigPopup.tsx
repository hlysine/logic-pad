import { memo, useEffect, useRef } from 'react';
import { getInstruction, useConfig } from '../ConfigContext';
import Config from './parts/Config';
import Rule from '../../data/rules/rule';
import { useGrid } from '../GridContext';

function getPosition(
  targetRef: React.RefObject<HTMLElement>,
  boxRef: React.RefObject<HTMLElement>
) {
  const targetRect = targetRef.current?.getBoundingClientRect();
  const boxRect = boxRef.current?.getBoundingClientRect();
  const windowRect = document.body.getBoundingClientRect();
  if (!targetRect || !boxRect) return undefined;
  const ret: { left: string; top: string } = {
    left: 'auto',
    top: 'auto',
  };
  if (windowRect.width < 1000) {
    if (targetRect.top > windowRect.height / 2) {
      ret.top = `${targetRect.top - boxRect.height}px`;
    } else {
      ret.top = `${targetRect.bottom}px`;
    }
    if (targetRect.left > windowRect.width / 2) {
      ret.left = `${targetRect.right - boxRect.width}px`;
    } else {
      ret.left = `${targetRect.left}px`;
    }
  } else {
    if (targetRect.left > windowRect.width / 2) {
      ret.left = `${targetRect.left - boxRect.width}px`;
    } else {
      ret.left = `${targetRect.right}px`;
    }
    if (targetRect.top > windowRect.height / 2) {
      ret.top = `${targetRect.bottom - boxRect.height}px`;
    } else {
      ret.top = `${targetRect.top}px`;
    }
  }
  return ret;
}

export default memo(function ConfigPopup() {
  const { location, ref, setLocation, setRef } = useConfig();
  const { grid, setGrid } = useGrid();

  const instruction = location ? getInstruction(grid, location) : undefined;

  useEffect(() => {
    if (!instruction) {
      setLocation(undefined);
      setRef(undefined);
    }
  }, [instruction, setLocation, setRef]);

  const popupRef = useRef<HTMLDivElement>(null);

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
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [setLocation, setRef, ref]);

  useEffect(() => {
    if (!ref?.current || !popupRef.current) return;
    const styles = getPosition(ref, popupRef);
    if (!styles) return;
    popupRef.current.style.left = styles.left;
    popupRef.current.style.top = styles.top;
  }, [ref, popupRef]);

  if (!instruction || !ref) return null;

  return (
    <div className=" fixed transition-all p-4" ref={popupRef}>
      <div className="p-4 z-30 bg-base-300 text-base-content shadow-xl rounded-box w-[400px]">
        {instruction.configs
          ?.filter(config => config.configurable)
          .map(config => (
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
                } else {
                  throw new Error('Not implemented');
                }
              }}
            />
          ))}
      </div>
    </div>
  );
});
