import React, { memo } from 'react';
import { cn } from '../../utils';
import DartSymbolData from '../../data/symbols/dartSymbol';
import { Direction } from '../../data/primitives';
import {
  HiMiniArrowLongDown,
  HiMiniArrowLongLeft,
  HiMiniArrowLongRight,
  HiMiniArrowLongUp,
} from 'react-icons/hi2';

export interface DartProps {
  textClass: string;
  symbol: DartSymbolData;
}

const orientations = {
  [Direction.Up]: {
    arrowIcon: HiMiniArrowLongUp,
    arrowStitch: {
      right: 0,
      marginLeft: 'auto',
    },
    numberDisplacement: {
      transform: 'translateX(-0.20em)',
    },
  },
  [Direction.Left]: {
    arrowIcon: HiMiniArrowLongLeft,
    arrowStitch: {
      top: 0,
      marginBottom: 'auto',
    },
    numberDisplacement: {
      transform: 'translateY(0.20em)',
    },
  },
  [Direction.Down]: {
    arrowIcon: HiMiniArrowLongDown,
    arrowStitch: {
      left: 0,
      marginRight: 'auto',
    },
    numberDisplacement: {
      transform: 'translateX(0.20em)',
    },
  },
  [Direction.Right]: {
    arrowIcon: HiMiniArrowLongRight,
    arrowStitch: {
      bottom: 0,
      marginTop: 'auto',
    },
    numberDisplacement: {
      transform: 'translateY(-0.20em)',
    },
  },
};

export default memo(function DartSymbol({ textClass, symbol }: DartProps) {
  const direction = symbol.orientation;
  return (
    <div
      className={cn(
        'absolute flex justify-center items-center w-full h-full pointer-events-none',
        textClass
      )}
    >
      <span
        className={cn('absolute text-[0.55em]', textClass)}
        style={orientations[direction].numberDisplacement}
      >
        {symbol.number}
      </span>
      <div
        className={cn('absolute', textClass, '-m-[0.10em]')}
        style={orientations[direction].arrowStitch}
      >
        {React.createElement(orientations[direction].arrowIcon, {
          size: '0.7em',
        })}
      </div>
    </div>
  );
});

export const id = 'dart';
