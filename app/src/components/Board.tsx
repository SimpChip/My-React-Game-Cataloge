import { useEffect, useState } from "react";

interface CellState {
  isMine: boolean;
  isRevealed: boolean;
  adjacentMines: number;
  isFlagged: boolean;
}

interface BoardState {
  cells: CellState[][];
  totalMines: number;
  revealedCells: number;
  minesFlaged: number;
  isGameOver: boolean;
  isGameWon: boolean;
}

interface CellProps {
  cell: CellState;
}

const boardSize = [30, 16];

function Board() {
  const [board, setBoard] = useState<BoardState>({
    cells: [],
    totalMines: 0,
    revealedCells: 0,
    minesFlaged: 0,
    isGameOver: false,
    isGameWon: false,
  });

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    generateBoardWithMines();
  }, []);

  useEffect(() => {
    console.log("board changed");
  }, [board]);

  function check(board: BoardState, x: number, y: number): BoardState {
    if (
      board.cells[x][y].adjacentMines === 0 &&
      !board.cells[x][y].isRevealed
    ) {
      board.revealedCells += 1;
      board.cells[x][y].isRevealed = true;
      if (x > 0) {
        board = check(board, x - 1, y);
        if (y > 0) {
          board = check(board, x - 1, y - 1);
        }
        if (y < board.cells[0].length - 1) {
          board = check(board, x - 1, y + 1);
        }
      }
      if (x < board.cells.length - 1) {
        board = check(board, x + 1, y);
        if (y > 0) {
          board = check(board, x + 1, y - 1);
        }
        if (y < board.cells[0].length - 1) {
          board = check(board, x + 1, y + 1);
        }
      }
      if (y > 0) {
        board = check(board, x, y - 1);
      }
      if (y < board.cells[0].length - 1) {
        board = check(board, x, y + 1);
      }
    } else if (!board.cells[x][y].isRevealed) {
      board.revealedCells += 1;
      board.cells[x][y].isRevealed = true;
    }

    return board;
  }

  function handleReveal(
    rowIndex: number,
    colIndex: number,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (!board.isGameOver && !board.isGameWon) {
      console.log(rowIndex, colIndex);
      let newBoard = { ...board };
      let cell = newBoard.cells[rowIndex][colIndex];

      if (!cell.isRevealed) {
        if (event.nativeEvent.button === 0 && !cell.isFlagged) {
          if (cell.isMine) {
            cell.isRevealed = true;
            newBoard.isGameOver = true;
          } else {
            newBoard = check(newBoard, rowIndex, colIndex);
          }
        } else if (event.nativeEvent.button === 2) {
          if (!cell.isFlagged) {
            if (cell.isMine) {
              newBoard.minesFlaged += 1;
            }
            cell.isFlagged = true;
          } else {
            if (cell.isMine) {
              newBoard.minesFlaged -= 1;
            }
            cell.isFlagged = false;
          }
        }

        if (
          newBoard.totalMines === newBoard.minesFlaged ||
          newBoard.totalMines + newBoard.revealedCells ===
            boardSize[0] * boardSize[1]
        ) {
          newBoard.isGameWon = true;
        }

        setBoard(newBoard);
      }
    } else {
      console.log("WHATTTTTTTT");
      generateBoardWithMines();
    }
  }

  function generateBoardWithMines() {
    const defaultBoard: BoardState = {
      cells: [],
      totalMines: 0,
      revealedCells: 0,
      minesFlaged: 0,
      isGameOver: false,
      isGameWon: false,
    };

    function generateAdjecentNumber() {
      for (let i = 0; i < boardSize[1]; i++) {
        for (let j = 0; j < boardSize[0]; j++) {
          if (defaultBoard.cells[i][j].isMine) {
            if (i !== 0) {
              defaultBoard.cells[i - 1][j].adjacentMines += 1;
              if (j !== 0) {
                defaultBoard.cells[i - 1][j - 1].adjacentMines += 1;
              }
              if (j !== boardSize[0] - 1) {
                defaultBoard.cells[i - 1][j + 1].adjacentMines += 1;
              }
            }
            if (i !== boardSize[1] - 1) {
              defaultBoard.cells[i + 1][j].adjacentMines += 1;

              if (j !== 0) {
                defaultBoard.cells[i + 1][j - 1].adjacentMines += 1;
              }
              if (j !== boardSize[0] - 1) {
                defaultBoard.cells[i + 1][j + 1].adjacentMines += 1;
              }
            }

            if (j !== 0) {
              defaultBoard.cells[i][j - 1].adjacentMines += 1;
            }
            if (j !== boardSize[0] - 1) {
              defaultBoard.cells[i][j + 1].adjacentMines += 1;
            }
          }
        }
      }
      setBoard(defaultBoard);
    }

    for (let i = 0; i < boardSize[1]; i++) {
      const row: CellState[] = [];
      for (let j = 0; j < boardSize[0]; j++) {
        const number = Math.floor(Math.random() * 40);

        const cell: CellState = {
          isMine: false,
          isRevealed: false,
          adjacentMines: 0,
          isFlagged: false,
        };

        if (number === 0) {
          cell.isMine = true;
          defaultBoard.totalMines += 1;
        }

        row.push(cell);
      }
      defaultBoard.cells.push(row);
    }

    generateAdjecentNumber();
  }

  function Cell({ cell }: CellProps) {
    if (board.isGameWon) {
      return <div className="w-full h-full bg-green-500" />;
    } else {
      if (!cell.isRevealed) {
        if (!cell.isFlagged) {
          return <div className="w-full h-full bg-gray-700" />;
        } else {
          return <div className="w-full h-full bg-green-500" />;
        }
      } else {
        if (cell.isMine) {
          return <div className="w-full h-full bg-red-700" />;
        } else if (cell.adjacentMines !== 0) {
          return (
            <div className="w-full h-full bg-gray-500 ">
              {cell.adjacentMines}
            </div>
          );
        } else {
          return <div className="w-full h-full bg-gray-500 " />;
        }
      }
    }
  }

  const renderBoard = () => {
    return board.cells.map((row, rowIndex) => {
      return (
        <div className={"flex"} key={`row-${rowIndex}`}>
          {row.map((cell, colIndex) => {
            return (
              <button
                onClick={(event) => handleReveal(rowIndex, colIndex, event)}
                onContextMenu={(event) =>
                  handleReveal(rowIndex, colIndex, event)
                }
                className="w-6 h-6 border-2 border-black"
                key={`cell-${colIndex}`}
              >
                <Cell cell={cell} />
              </button>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={"flex flex-col items-center"}>
      <div className={"flex flex-col items-center"}>{renderBoard()}</div>
      {board.isGameWon ? (
        <div className={"flex flex-col items-center p-2"}>
          <p className="text-xl">GAME WON</p>
          <p className="text-lg">click to start again</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Board;
