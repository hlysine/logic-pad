import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/viewpointSymbol';
import ViewpointSymbol from '../../symbols/ViewpointSymbol';

const sample = instance;

export default memo(function ViewpointTool() {
  return (
    <SymbolTool
      name="Viewpoint"
      order={103}
      hotkey="baseSymbols-2"
      sample={sample}
      component={ViewpointSymbol}
    />
  );
});
