import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import GalaxySymbolData from '../../../data/symbols/galaxySymbol';
import GalaxySymbol from '../../symbols/GalaxySymbol';

const sample = new GalaxySymbolData(0, 0);

export default memo(function GalaxyTool() {
  return (
    <SymbolTool
      name="Galaxy"
      sample={sample}
      placementStep={0.5}
      component={GalaxySymbol}
    />
  );
});
