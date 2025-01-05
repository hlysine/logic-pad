import { memo } from 'react';
import { cn } from '../../client/uiHelper.ts';
import GalaxySymbolData from '@logic-pad/core/data/symbols/galaxySymbol.js';
import { TbGalaxy } from 'react-icons/tb';

export interface GalaxyProps {
  textClass: string;
  symbol: GalaxySymbolData;
}

export default memo(function GalaxySymbol({ textClass }: GalaxyProps) {
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span className={cn('absolute m-auto text-[0.75em]', textClass)}>
        <TbGalaxy />
      </span>
    </div>
  );
});

export const id = 'galaxy';
