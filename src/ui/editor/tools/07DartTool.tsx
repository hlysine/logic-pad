import { memo } from 'react';
import SymbolTool from '../SymbolTool';
import DartSymbolData from '../../../data/symbols/dartSymbol';
import DartSymbol from '../../symbols/DartSymbol';
import { Direction } from '../../../data/primitives';

const sample = new DartSymbolData(0, 0, 1, Direction.Right);

export default memo(function DartTool() {
  return <SymbolTool name="Dart" sample={sample} component={DartSymbol} />;
});
