import Tile from './tile/Tile';
import TileData, { Color } from './data/tile';

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Tile
        size={100}
        data={TileData.empty()
          .withExists(true)
          .withNumber(3)
          .withColor(Color.White)}
      />
    </div>
  );
}
