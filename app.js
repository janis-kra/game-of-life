const state = mobx.observable({
  cells: [],
  generations: 0,
  size: {
    x: 50,
    y: 50
  },
  running: true,
  speed: 100 // speed in ms
});

const getNeighborsForCoords = (col, row) => [
  [col - 1, row - 1],
  [col - 1, row],
  [col - 1, row + 1],
  [col, row - 1],
  [col, row + 1],
  [col + 1, row - 1],
  [col + 1, row],
  [col + 1, row + 1]
].map((coords) => {
  const rowIndex = coords[1] === -1 ? state.size.x - 1 :
    coords[1] === state.size.x ? 0 : coords[1];
  const colIndex = coords[0] === -1 ? state.size.y - 1 :
    coords[0] === state.size.y ? 0 : coords[0];
  return state.cells[colIndex][rowIndex];
});

const updateCell = (cell, col, row) => {
  let age;
  const neighbors = getNeighborsForCoords(col, row);
  const aliveNeighbors = neighbors.reduce((aliveCells, c) => {
    return aliveCells + (c.age === 0 ? 0 : 1);
  }, 0);

  if (aliveNeighbors === 3 ||
    aliveNeighbors === 2 && cell.age > 0) {
    age = cell.age + 1; // springs alive or gets older
  } else {
    age = 0; // die by over- /underpopulation
  }

  return {
    ...cell,
    age: age
  };
};

const updateCells = () => {
  state.generations = state.generations + 1;
  const cells = state.cells.map((cellColumn, colIndex) =>
    cellColumn.map((cell, index) => updateCell(cell, colIndex, index))
  );
  state.cells = cells;
};

const getClassForCell = (age) => {
  if (age <= 0) {
    return 'dead';
  } else if (age === 1) {
    return 'alive';
  } else if (age > 1) {
    return 'alive stable';
  }
};

const rollAge = () => {
  const roll = Math.random();
  if (roll < 0.9) {
    return 0;
  } else {
    return 1;
  }
};

const restartCells = () => {
  state.running = false;
  state.generations = 0;
  state.cells = [];
  for (let i = 0; i < state.size.x; i++) { // cols
    state.cells.push([]); // push new column
    for (let j = 0; j < state.size.y; j++) { // rows
      state.cells[i].push({ age: rollAge(), x: i, y: j }); // push new cell at row j and column i
    }
  }
};

const start = () => {
  setInterval(() => {
    if (state.running) {
      updateCells();
    }
  }, state.speed);
};

const clear = () => {
  state.running = false;
  state.cells = [];
  state.generations = 0;
};

const toggleRunning = () => {
  state.running = !state.running;
};

const Cell = ({ age, x, y }) => (
  <div className={ 'cell ' + getClassForCell(age) }
       onClick={
         () => {
           const cellState = state.cells[x][y];
           cellState.age = (!cellState.age) | 0;
         }
       }/>
);

/**
 * The board that displays all the cells
 */
const Life = mobxReact.observer(() => (
  <div className='life'>
    { state.cells.map((column) => {
      return (
        <div className='column'>
          { column.map((cell) => <Cell {...cell} />) }
        </div>
      );
    })}
  </div>
));

const Controls = mobxReact.observer(() => (
  <div className='controls'>
    <div>Generation { state.generations }</div>
    <button onClick={ toggleRunning }>Start / Stop</button>
    <button onClick={ restartCells }>Restart</button>
    <button onClick={ clear }>Clear</button>
  </div>
));

const Footer = () => (
  <div className='footer'>
    <h4>by <a href='https://github.com/janis-kra'>Janis Krasemann</a></h4>
  </div>
);

const App = () => {
  restartCells();
  state.running = true;
  start();
  return (
    <div>
      <h1>Game Of Life</h1>
      <Controls />
      <Life />
      <Footer />
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
