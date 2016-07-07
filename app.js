const state = mobx.observable({
  cells: [],
  size: {
    x: 5,
    y: 5
  },
  running: false,
  speed: 1000 // speed in ms
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
  if (aliveNeighbors > 2 ||
    aliveNeighbors === 2 && cell.age > 0) {
    age = cell.age + 1; // springs alive or gets older
  } else {
    age = 0;
  }
  return {
    ...cell,
    age: age
  };
};

const updateCells = () => {
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
  if (roll < 0.85) {
    return 0;
  } else {
    return 1;
  }
};

const Cell = ({ age }) => (
  <div className={ 'cell ' + getClassForCell(age) } />
);

/**
 * The board that displays all the cells
 */
const Life = mobxReact.observer(() => (
  <div className='life'>
    { state.cells.map((cellRow) => {
      return (
        <div className='cellRow'>
          { cellRow.map((cell) => <Cell {...cell} />) }
        </div>
      );
    })}
  </div>
));

const Controls = () => (
  <div className='controls'>
    Controls
  </div>
);

const App = () => {
  for (let i = 0; i < state.size.x; i++) { // cols
    state.cells.push([]); // push new column
    for (let j = 0; j < state.size.y; j++) { // rows
      state.cells[i].push({ age: rollAge() }); // push new cell at row j and column i
    }
  }
  updateCells();
  return (
    <div>
      <h1>Game Of Life</h1>
      <Controls />
      <Life />
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
