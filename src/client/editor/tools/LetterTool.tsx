import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/letterSymbol';
import LetterSymbol from '../../symbols/LetterSymbol';

const sample = instance;

export default memo(function LetterTool() {
  return (
    <SymbolTool
      name="Letter"
      order={102}
      hotkey="baseSymbols-1"
      sample={sample}
      component={LetterSymbol}
    />
  );
});
