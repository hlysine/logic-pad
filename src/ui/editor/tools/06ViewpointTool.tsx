import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import ViewpointSymbolData from '../../../data/symbols/viewpointSymbol';
import ViewpointSymbol from '../../symbols/ViewpointSymbol';

const sample = new ViewpointSymbolData(0, 0, 1);

export default memo(function ViewpointTool() {
  return (
    <SymbolTool
      name="Viewpoint"
      sample={sample}
      placementStep={1}
      component={ViewpointSymbol}
    />
  );
});
