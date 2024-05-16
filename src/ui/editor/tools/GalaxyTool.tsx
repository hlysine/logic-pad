import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '../../../data/symbols/galaxySymbol';
import GalaxySymbol from '../../symbols/GalaxySymbol';

const sample = instance;

export default memo(function GalaxyTool() {
  return (
    <SymbolTool
      name="Galaxy"
      order={10}
      sample={sample}
      component={GalaxySymbol}
    />
  );
});
