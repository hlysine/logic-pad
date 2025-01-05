import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/galaxySymbol.js';
import GalaxySymbol from '../../symbols/GalaxySymbol';

const sample = instance;

export default memo(function GalaxyTool() {
  return (
    <SymbolTool
      name="Galaxy"
      order={11}
      hotkey="6"
      sample={sample}
      component={GalaxySymbol}
    />
  );
});
