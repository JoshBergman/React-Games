import { LuFlagTriangleLeft } from "react-icons/lu";
import { FaVirusCovidSlash } from "react-icons/fa6";
import { GiFlowerEmblem } from "react-icons/gi";
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
        return "rgb(20, 20, 193)";
      case 2:
        return "green";
      case "F":
        return "crimson";
      case 3:
        return "rgb(173, 12, 44)";
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

  const getDisplayIcon = () => {
    switch (displayValue) {
      case "F":
        return <LuFlagTriangleLeft style={{ marginTop: "5px" }} />;
      case "K":
        return <FaVirusCovidSlash style={{ marginTop: "5px", color: "red" }} />;
      case "L":
        return <GiFlowerEmblem style={{ marginTop: "5px", color: "black" }} />;
      default:
        return displayValue;
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
      {getDisplayIcon()}
    </div>
  );
};

export default MS_Tile;
