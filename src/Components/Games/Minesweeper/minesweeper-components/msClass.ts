export type Tboard = [string, string | number][][];

export class MS {
  board: Tboard;
  isFirstClick: boolean;
  updateGame: React.Dispatch<React.SetStateAction<Tboard>>;
  constructor(
    height: number,
    width: number,
    mineCount: number,
    setState: React.Dispatch<React.SetStateAction<Tboard>>
  ) {
    this.updateGame = setState;
    this.isFirstClick = true;
    this.board = this.generateGameBoard(width, height, mineCount);
  }

  renderBoard() {
    this.updateGame(this.board.concat([]));
  }

  generateGameBoard(x: number, y: number, mineCount: number) {
    const [gameBoard, boardSpaces] = makeEmptyBoard();
    placeMines(
      gameBoard,
      mineCount >= boardSpaces ? boardSpaces - 1 : mineCount
    );

    return gameBoard;

    function makeEmptyBoard(): [Tboard, number] {
      const newBoard: [string, string | number][][] = [];
      let boardSpaces: number = 0;
      for (let i = 0; i < y; i++) {
        newBoard.push([]);
        for (let j = 0; j < x; j++) {
          newBoard[i].push(["E", "U"]);
          boardSpaces += 1;
        }
      }
      return [newBoard, boardSpaces];
    }

    function placeMines(newBoard: Tboard, mineCount: number) {
      let minesRemaining = mineCount;
      while (minesRemaining > 0) {
        //With large mine counts on big boards this code is not great but its random!
        const [randX, randY] = getRandomSpot(newBoard);
        if (newBoard[randY][randX][0] !== "M") {
          //if space isnt a mine, set it to a mine
          newBoard[randY][randX][0] = "M";
          minesRemaining -= 1;
        }
      }
      function getRandomSpot(board: Tboard) {
        const randomY = getRandomNum(0, board.length - 1);
        const randomX = getRandomNum(0, board[0].length - 1);
        return [randomX, randomY];
      }

      function getRandomNum(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
  }

  rightClick(x: number, y: number) {
    const board = this.board;
    if (!board[y] || !board[y][x]) {
      console.error("Clicked out of game boundaries - MS.rightClick");
      return;
    }
    const [cellValue, userValue] = this.getCellValue(x, y, board) || [
      null,
      null,
    ];
    if (!cellValue || !userValue) return;
    if (userValue === "F") {
      board[y][x][1] = "U";
    } else if (userValue === "U") {
      board[y][x][1] = "F";
    }
    this.renderBoard();
  }

  leftClick(x: number, y: number) {
    const board = this.board;
    if (!board[y] || !board[y][x]) {
      console.error("Clicked out of game boundaries - MS.leftClick");
      return;
    }

    const [cellValue, userValue] = this.getCellValue(x, y, board) || [
      null,
      null,
    ];
    if (!cellValue || !userValue) return;
    if (userValue === "F" || userValue === "K" || userValue === "L") return; //clicking flag shouldnt do anything
    if (this.isFirstClick) {
      this.isFirstClick = false;
      this.firstLeftClickAreaGen(x, y, board);
      return;
    }
    switch (cellValue) {
      case "M": //user clicks on mine
        board[y][x][1] = "K";
        this.completeGame(false, board);
        break;
      case "E": //user clicks on empty
        this.popCell(x, y, board);
        if (this.checkForWin(board)) {
          console.log("YOU WIN!");
        }
        break;
      default:
        console.error(`Invalid value at ${x}, ${y}`);
        break;
    }
    this.renderBoard();
  }

  resetGame(height: number, width: number, mineCount: number) {
    this.board = this.generateGameBoard(height, width, mineCount);
    this.isFirstClick = true;
    this.renderBoard();
  }

  popCell(x: number, y: number, board: Tboard) {
    if (!board[y] || !board[y][x]) {
      console.error("Out of game boundaries - MS.popCell");
      return;
    }

    const userValue = board[y][x][1];
    if (userValue === "U") {
      const nearbyMines = this.getSurroundingMineCount(x, y, board);
      if (nearbyMines === 0) {
        this.clearField(x, y, board);
      } else {
        board[y][x][1] = nearbyMines;
      }
    }
  }

  clearField(x: number, y: number, board: Tboard) {
    const posModifiers = [
      // [xMod, yMod]
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
    ];

    const cellValue = this.getCellValue(x, y, board);
    if (!cellValue) {
      return;
    }

    const nearbyMines = this.getSurroundingMineCount(x, y, board);
    if (nearbyMines === 0 && cellValue[0] !== "M" && cellValue[1] === "U") {
      board[y][x][1] = 0;
      for (let i = 0; i < posModifiers.length; i++) {
        const xMod = x + posModifiers[i][0];
        const yMod = y + posModifiers[i][1];
        this.clearField(xMod, yMod, board);
      }
    } else if (
      nearbyMines !== 0 &&
      cellValue[1] === "U" &&
      cellValue[0] !== "M"
    ) {
      board[y][x][1] = nearbyMines;
    }
  }

  firstLeftClickAreaGen(x: number, y: number, board: Tboard) {
    const posModifiers = [
      // [xMod, yMod]
      [0, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
    ];
    for (let i = 0; i < posModifiers.length; i++) {
      const xMod = x + posModifiers[i][0];
      const yMod = y + posModifiers[i][1];
      if (this.getCellValue(xMod, yMod, board)) {
        board[yMod][xMod][0] = "E";
      }
    }
    this.leftClick(x, y);
  }

  getCellValue(x: number, y: number, board: Tboard): null | Tboard[0][0] {
    if (!board[y] || !board[y][x]) {
      return null;
    }

    return board[y][x];
  }

  getSurroundingMineCount(x: number, y: number, board: Tboard): number {
    const posModifiers = [
      // [xMod, yMod]
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
    ];
    let nearbyMines = 0;
    for (let i = 0; i < posModifiers.length; i++) {
      const xModded = x + posModifiers[i][0];
      const yModded = y + posModifiers[i][1];
      if (board[yModded] && board[yModded][xModded]) {
        const cellValue = board[yModded][xModded][0];
        if (cellValue === "M") {
          nearbyMines += 1;
        }
      }
    }

    return nearbyMines;
  }

  checkForWin(board: Tboard) {
    const [height, width] = this.getBoardDimensions(board);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cellValue = this.getCellValue(x, y, board);
        if (!cellValue) return false;
        if (
          (cellValue[0] !== "M" && cellValue[1] === "U") ||
          cellValue[1] === "F"
        ) {
          return false;
        }
      }
    }

    //only runs if game is won => registers win
    this.completeGame(true, board);
    return true;
  }

  completeGame(hasWon: boolean, board: Tboard) {
    const [height, width] = this.getBoardDimensions(board);
    const fillValue = hasWon ? "F" : "L";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cellValue = this.getCellValue(x, y, board);
        if (!cellValue) continue;
        if (cellValue[0] === "M" && cellValue[1] !== "K") {
          board[y][x][1] = fillValue;
        }
      }
    }
    this.renderBoard();
  }

  getBoardDimensions(board: Tboard) {
    const height = board.length;
    const width = board[0].length;

    return [height, width];
  }
}
