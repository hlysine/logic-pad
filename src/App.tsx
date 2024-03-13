import Grid from './ui/Grid';
import GridData from './data/grid';
import { useState } from 'react';
import { Color } from './data/primitives';
import LetterSymbol from './data/symbols/letterSymbol';
import InstructionList from './ui/InstructionList';
import NumberSymbol from './data/symbols/numberSymbol';

export default function App() {
  const [grid, setGrid] = useState(
    new GridData(10, 10)
      .addSymbol(new NumberSymbol(0, 0, 5))
      .addSymbol(new NumberSymbol(0, 9, 5))
      .addSymbol(new NumberSymbol(9, 0, 5))
      .addSymbol(new NumberSymbol(9, 9, 5))
      .setTile(1, 0, t => t.withFixed(true).withColor(Color.Black))
      .setTile(3, 0, t => t.withFixed(true).withColor(Color.Black))
      .addSymbol(new LetterSymbol(3, 0, 'A'))
      .setTile(6, 0, t => t.withFixed(true).withColor(Color.White))
      .addSymbol(new LetterSymbol(6, 0, 'B'))
      .setTile(1, 1, t => t.withFixed(true).withColor(Color.White))
      .setTile(3, 1, t => t.withFixed(true).withColor(Color.Black))
      .setTile(5, 1, t => t.withFixed(true).withColor(Color.White))
      .setTile(9, 1, t => t.withFixed(true).withColor(Color.White))
      .setTile(2, 2, t => t.withFixed(true).withColor(Color.White))
      .setTile(4, 2, t => t.withFixed(true).withColor(Color.Black))
      .setTile(6, 2, t => t.withFixed(true).withColor(Color.Black))
      .setTile(7, 2, t => t.withFixed(true).withColor(Color.White))
      .setTile(0, 3, t => t.withFixed(true).withColor(Color.White))
      .addSymbol(new LetterSymbol(0, 3, 'C'))
      .setTile(6, 3, t => t.withFixed(true).withColor(Color.White))
      .setTile(7, 3, t => t.withFixed(true).withColor(Color.Black))
      .setTile(9, 3, t => t.withFixed(true).withColor(Color.Black))
      .addSymbol(new LetterSymbol(9, 3, 'D'))
      .setTile(1, 4, t => t.withFixed(true).withColor(Color.White))
      .setTile(4, 4, t => t.withFixed(true).withColor(Color.Black))
      .setTile(5, 4, t => t.withFixed(true).withColor(Color.White))
      .setTile(8, 4, t => t.withFixed(true).withColor(Color.Black))
      .setTile(1, 5, t => t.withFixed(true).withColor(Color.Black))
      .setTile(4, 5, t => t.withFixed(true).withColor(Color.White))
      .setTile(5, 5, t => t.withFixed(true).withColor(Color.Black))
      .setTile(8, 5, t => t.withFixed(true).withColor(Color.Black))
      .setTile(0, 6, t => t.withFixed(true).withColor(Color.Black))
      .addSymbol(new LetterSymbol(0, 6, 'E'))
      .setTile(2, 6, t => t.withFixed(true).withColor(Color.Black))
      .setTile(3, 6, t => t.withFixed(true).withColor(Color.White))
      .setTile(9, 6, t => t.withFixed(true).withColor(Color.White))
      .addSymbol(new LetterSymbol(9, 6, 'F'))
      .setTile(2, 7, t => t.withFixed(true).withColor(Color.White))
      .setTile(3, 7, t => t.withFixed(true).withColor(Color.Black))
      .setTile(5, 7, t => t.withFixed(true).withColor(Color.White))
      .setTile(7, 7, t => t.withFixed(true).withColor(Color.Black))
      .setTile(0, 8, t => t.withFixed(true).withColor(Color.White))
      .setTile(4, 8, t => t.withFixed(true).withColor(Color.Black))
      .setTile(6, 8, t => t.withFixed(true).withColor(Color.White))
      .setTile(8, 8, t => t.withFixed(true).withColor(Color.Black))
      .setTile(3, 9, t => t.withFixed(true).withColor(Color.White))
      .addSymbol(new LetterSymbol(3, 9, 'G'))
      .setTile(6, 9, t => t.withFixed(true).withColor(Color.Black))
      .addSymbol(new LetterSymbol(6, 9, 'H'))
      .setTile(8, 9, t => t.withFixed(true).withColor(Color.White))
  );
  return (
    <div className="h-dvh w-dvw overflow-scroll">
      <div className="flex justify-center items-center min-h-full w-full">
        <div className="w-[320px]"></div>
        <div className="flex-1 flex justify-center items-center">
          <Grid
            size={60}
            grid={grid}
            editable={true}
            onTileClick={(x, y, target) =>
              setGrid(grid => grid.setTile(x, y, t => t.withColor(target)))
            }
          />
        </div>
        <InstructionList data={grid} />
      </div>
    </div>
  );
}
