import { memo, useRef } from 'react';
import {
  getConfigurableLocation,
  useConfig,
} from '../contexts/ConfigContext.tsx';
import { useGrid } from '../contexts/GridContext.tsx';
import Configurable from '@logic-pad/core/data/configurable';
import Symbol from '@logic-pad/core/data/symbols/symbol';

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
        setLocation(getConfigurableLocation(grid, configurable as Symbol));
        setRef(divRef);
      }}
    ></div>
  );
});
