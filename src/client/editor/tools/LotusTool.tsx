import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '../../../data/symbols/lotusSymbol';
import LotusSymbol from '../../symbols/LotusSymbol';

const sample = instance;

export default memo(function LotusTool() {
  return (
    <SymbolTool
      name="Lotus"
      order={10}
      hotkey="5"
      sample={sample}
      component={LotusSymbol}
    />
  );
});
