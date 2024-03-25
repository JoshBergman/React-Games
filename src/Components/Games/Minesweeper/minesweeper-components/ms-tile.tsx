import { LuFlagTriangleLeft } from "react-icons/lu";
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

  const getNumColor = () => {
    switch (displayValue) {
      case 0:
        return "transparent";
      case 1:
        return "blue";
      case 2:
        return "green";
      case "F":
      case 3:
        return "crimson";
      case 4:
        return "navy";
      case 5:
        return "darkred";
      case 6:
        return "darkcyan";
      case 7:
        return "black";
      case 8:
        return "dimgray";
    }
  };

  return (
    <div
      className={styles.tile + " " + styles[getCellStyle()]}
      style={{ color: getNumColor() }}
      onClick={() => {
        game.current.leftClick(x, y);
      }}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
        game.current.rightClick(x, y);
      }}
    >
      {displayValue === "F" ? (
        <LuFlagTriangleLeft style={{ marginTop: "5px" }} />
      ) : (
        displayValue
      )}
    </div>
  );
};

export default MS_Tile;
