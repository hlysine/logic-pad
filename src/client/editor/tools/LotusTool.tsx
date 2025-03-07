import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/lotusSymbol';
import LotusSymbol from '../../symbols/LotusSymbol';

const sample = instance;

export default memo(function LotusTool() {
  return (
    <SymbolTool
      name="Lotus"
      order={105}
      hotkey="5"
      sample={sample}
      component={LotusSymbol}
    />
  );
});
