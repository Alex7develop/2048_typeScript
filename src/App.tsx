
import './App.css'
import Grid from './components/Grid';
import { useGameState } from './hooks/useGameState';
import Game from './tools/game';

export const game = new Game(4);

function App() {

  const { state, lastKey } = useGameState(game);

  return (
    <div className='page'>
      <Grid state={state} lastKey={lastKey} />
    </div>
  );

}

export default App;
