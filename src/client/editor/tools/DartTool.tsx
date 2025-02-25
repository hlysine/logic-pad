import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '@logic-pad/core/data/symbols/dartSymbol';
import DartSymbol from '../../symbols/DartSymbol';

const sample = instance;

export default memo(function DartTool() {
  return (
    <SymbolTool
      name="Dart"
      order={104}
      hotkey="4"
      sample={sample}
      component={DartSymbol}
    />
  );
});
