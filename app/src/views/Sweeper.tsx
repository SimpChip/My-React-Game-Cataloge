import Board from "../components/Board";

function Sweeper() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="p-2 text-4xl">Minesweeper</h1>
      <Board />
    </div>
  );
}

export default Sweeper;
