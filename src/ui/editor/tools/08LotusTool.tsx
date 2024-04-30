import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import LotusSymbolData from '../../../data/symbols/lotusSymbol';
import LotusSymbol from '../../symbols/LotusSymbol';
import { Orientation } from '../../../data/primitives';

const sample = new LotusSymbolData(0, 0, Orientation.Up);

export default memo(function LotusTool() {
  return (
    <SymbolTool
      name="Lotus"
      sample={sample}
      placementStep={0.5}
      component={LotusSymbol}
    />
  );
});
