import { memo, useRef } from 'react';
import { getConfigurableLocation, useConfig } from '../ConfigContext';
import { useGrid } from '../GridContext';
import Configurable from '../../data/configurable';

export interface EditTargetProps {
  configurable: Configurable;
}

export default memo(function EditTarget({ configurable }: EditTargetProps) {
  const { setLocation, setRef } = useConfig();
  const { grid } = useGrid();
  const divRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={divRef}
      className="absolute inset-0 cursor-pointer"
      onPointerDown={() => {
        setLocation(getConfigurableLocation(grid, configurable));
        setRef(divRef);
      }}
    ></div>
  );
});
