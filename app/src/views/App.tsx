import { Link } from "react-router-dom";

function App() {
  return (
    <div className="px-2 pt-4">
      <h1 className="pb-4"> My Games</h1>
      <Link className={"border-2 rounded-sm p-2 border-black"} to={"/sweeper"}>
        Sweeper The Game V1
      </Link>
    </div>
  );
}

export default App;
