import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/myopiaSymbol';
import MyopiaSymbol from '../../symbols/MyopiaSymbol';

const sample = instance;

export default memo(function MyopiaTool() {
  return (
    <SymbolTool
      name="Myopia"
      order={107}
      hotkey="baseSymbols-6"
      sample={sample}
      component={MyopiaSymbol}
    />
  );
});
