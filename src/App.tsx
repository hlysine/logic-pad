import Grid from './ui/Grid';
import GridData from './data/grid';
import { useState } from 'react';
import NumberSymbol from './data/rules/number/numberSymbol';
import { Color } from './data/primitives';
import LetterSymbol from './data/rules/letter/letterSymbol';

export default function App() {
  const [grid, setGrid] = useState(
    new GridData(10, 10)
      .setTile(1, 0, t => t.withFixed(true).withColor(Color.Black))
      .setTile(3, 0, t =>
        t
          .withFixed(true)
          .withColor(Color.Black)
          .addSymbol(new LetterSymbol('A'))
      )
      .setTile(6, 0, t =>
        t
          .withFixed(true)
          .withColor(Color.White)
          .addSymbol(new LetterSymbol('B'))
      )
      .setTile(1, 1, t => t.withFixed(true).withColor(Color.White))
      .setTile(3, 1, t => t.withFixed(true).withColor(Color.Black))
      .setTile(5, 1, t => t.withFixed(true).withColor(Color.White))
      .setTile(9, 1, t => t.withFixed(true).withColor(Color.White))
      .setTile(2, 2, t => t.withFixed(true).withColor(Color.White))
      .setTile(4, 2, t => t.withFixed(true).withColor(Color.Black))
      .setTile(6, 2, t => t.withFixed(true).withColor(Color.Black))
      .setTile(7, 2, t => t.withFixed(true).withColor(Color.White))
      .setTile(0, 3, t =>
        t
          .withFixed(true)
          .withColor(Color.White)
          .addSymbol(new LetterSymbol('C'))
      )
      .setTile(6, 3, t => t.withFixed(true).withColor(Color.White))
      .setTile(7, 3, t => t.withFixed(true).withColor(Color.Black))
      .setTile(9, 3, t =>
        t
          .withFixed(true)
          .withColor(Color.Black)
          .addSymbol(new LetterSymbol('D'))
      )
      .setTile(1, 4, t => t.withFixed(true).withColor(Color.White))
      .setTile(4, 4, t => t.withFixed(true).withColor(Color.Black))
      .setTile(5, 4, t => t.withFixed(true).withColor(Color.White))
      .setTile(8, 4, t => t.withFixed(true).withColor(Color.Black))
      .setTile(1, 5, t => t.withFixed(true).withColor(Color.Black))
      .setTile(4, 5, t => t.withFixed(true).withColor(Color.White))
      .setTile(5, 5, t => t.withFixed(true).withColor(Color.Black))
      .setTile(8, 5, t => t.withFixed(true).withColor(Color.Black))
      .setTile(0, 6, t =>
        t
          .withFixed(true)
          .withColor(Color.Black)
          .addSymbol(new LetterSymbol('E'))
      )
      .setTile(2, 6, t => t.withFixed(true).withColor(Color.Black))
      .setTile(3, 6, t => t.withFixed(true).withColor(Color.White))
      .setTile(9, 6, t =>
        t
          .withFixed(true)
          .withColor(Color.White)
          .addSymbol(new LetterSymbol('F'))
      )
      .setTile(2, 7, t => t.withFixed(true).withColor(Color.White))
      .setTile(3, 7, t => t.withFixed(true).withColor(Color.Black))
      .setTile(5, 7, t => t.withFixed(true).withColor(Color.White))
      .setTile(7, 7, t => t.withFixed(true).withColor(Color.Black))
      .setTile(0, 8, t => t.withFixed(true).withColor(Color.White))
      .setTile(4, 8, t => t.withFixed(true).withColor(Color.Black))
      .setTile(6, 8, t => t.withFixed(true).withColor(Color.White))
      .setTile(8, 8, t => t.withFixed(true).withColor(Color.Black))
      .setTile(3, 9, t =>
        t
          .withFixed(true)
          .withColor(Color.White)
          .addSymbol(new LetterSymbol('G'))
      )
      .setTile(6, 9, t =>
        t
          .withFixed(true)
          .withColor(Color.Black)
          .addSymbol(new LetterSymbol('H'))
      )
      .setTile(8, 9, t => t.withFixed(true).withColor(Color.White))
  );
  return (
    <div className="h-dvh w-dvw overflow-scroll">
      <div className="flex justify-center items-center min-h-full">
        <Grid
          size={600}
          data={grid}
          onTileClick={(x, y, target) =>
            setGrid(grid => grid.setTile(x, y, t => t.withColor(target)))
          }
        />
      </div>
    </div>
  );
}
