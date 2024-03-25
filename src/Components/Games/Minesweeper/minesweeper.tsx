import { useEffect, useRef, useState } from "react";

import styles from "./minesweeper.module.css";
import MS_Tile from "./minesweeper-components/ms-tile";
import { MS, Tboard } from "./minesweeper-components/msClass";

const Minesweeper = () => {
  const gameWidth = 10;
  const gameHeight = 10;
  const gameMineCount = 5;
  const [board, setBoard] = useState<Tboard>([]);
  const game = useRef(new MS(gameHeight, gameWidth, gameMineCount, setBoard));

  useEffect(() => {
    game.current.resetGame(gameHeight, gameWidth, gameMineCount);
  }, []);

  const renderGameTiles = () => {
    if (!board || board.length <= 0) return;
    const height = board.length;
    const width = board[0].length;
    const rows = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(
          <MS_Tile
            displayValue={board[y][x][1]}
            x={x}
            y={y}
            game={game}
            key={"MSTILE-" + `${x}, ${y}`}
          />
        );
      }
      rows.push(
        <div className={styles.row} key={"ROW-" + y}>
          {row}
        </div>
      );
    }

    return rows;
  };

  return (
    <div>
      <h2>Minesweeper</h2>
      <button
        onClick={() => {
          game.current.resetGame(gameHeight, gameWidth, gameMineCount);
        }}
      >
        Reset
      </button>
      <div className={styles.baord}>
        {renderGameTiles()}
        <div>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <MS_Tile
              displayValue={num}
              x={num}
              y={num}
              game={game}
              key={"MSTILE-" + `${num}, ${num}`}
            />
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          game.current.leftClick(2, 2);
        }}
      >
        Pop Cell
      </button>
    </div>
  );
};

export default Minesweeper;
