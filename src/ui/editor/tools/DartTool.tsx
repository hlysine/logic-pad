import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import { instance } from '../../../data/symbols/dartSymbol';
import DartSymbol from '../../symbols/DartSymbol';

const sample = instance;

export default memo(function DartTool() {
  return (
    <SymbolTool name="Dart" order={8} sample={sample} component={DartSymbol} />
  );
});
