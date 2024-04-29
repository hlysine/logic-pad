import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import LetterSymbolData from '../../../data/symbols/letterSymbol';
import LetterSymbol from '../../symbols/LetterSymbol';

const sample = new LetterSymbolData(0, 0, 'A');

export default memo(function LetterTool() {
  return (
    <SymbolTool
      name="Letter"
      sample={sample}
      placementStep={0.5}
      component={LetterSymbol}
    />
  );
});
