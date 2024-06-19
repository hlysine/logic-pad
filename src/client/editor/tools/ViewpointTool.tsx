import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '../../../data/symbols/viewpointSymbol';
import ViewpointSymbol from '../../symbols/ViewpointSymbol';

const sample = instance;

export default memo(function ViewpointTool() {
  return (
    <SymbolTool
      name="Viewpoint"
      order={8}
      hotkey="3"
      sample={sample}
      component={ViewpointSymbol}
    />
  );
});
