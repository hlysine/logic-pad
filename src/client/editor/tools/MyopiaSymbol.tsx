import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/myopiaSymbol.js';
import MyopiaSymbol from '../../symbols/MyopiaSymbol';

const sample = instance;

export default memo(function MyopiaTool() {
  return (
    <SymbolTool
      name="Myopia"
      order={12}
      hotkey="7"
      sample={sample}
      component={MyopiaSymbol}
    />
  );
});
