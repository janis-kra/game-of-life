const state = mobx.observable({
  cells: [],
  size: {
    x: 10,
    y: 10
  }
});

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
  if (roll < 0.8) {
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
  for (let i = 0; i < state.size.x; i++) {
    state.cells.push([]);
    for (let j = 0; j < state.size.y; j++) {
      state.cells[i].push({ age: rollAge() });
    }
  }
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
