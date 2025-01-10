import { memo } from 'react';
import { instance } from '@logic-pad/core/data/symbols/minesweeperSymbol';
import SymbolTool from '../SymbolTool';
import MinesweeperSymbol from '../../symbols/MinesweeperSymbol';

const sample = instance;

export default memo(function MinesweeperTool() {
  return (
    <SymbolTool
      name="Minesweeper"
      order={13}
      hotkey="8"
      sample={sample}
      component={MinesweeperSymbol}
    />
  );
});
