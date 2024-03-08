import { MS } from "./msClass";
import styles from "./ms-tile.module.css";

interface IMS_TileProps {
  displayValue: string | number;
  x: number;
  y: number;
  game: React.MutableRefObject<MS>;
}

const MS_Tile = ({ displayValue, x, y, game }: IMS_TileProps) => {
  const getCellStyle = () => {
    switch (displayValue) {
      case "U":
        return "unknown";
      default:
        return "none";
    }
  };
  return (
    <div
      className={styles.tile + " " + styles[getCellStyle()]}
      onClick={() => {
        game.current.leftClick(x, y);
      }}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
        game.current.rightClick(x, y);
      }}
    >
      {displayValue}
    </div>
  );
};

export default MS_Tile;
