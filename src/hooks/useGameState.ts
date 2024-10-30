import { useEffect, useState } from "react"
import Game from "../tools/game";

const controlKeys: Set<ControlKey> = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"
]);

export function useGameState(game: Game) {

  const [state, setState] = useState<GameState>(game.state);
  const [lastKey, setLastKey] = useState<ControlKey>("ArrowLeft");

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [])

  function handleKeyPress(event: KeyboardEvent) {
    const { key } = event;
    // @ts-ignore
    if (controlKeys.has(key) === false) return;
    // @ts-ignore
    game.handleMove(key);
    setState(structuredClone(game.state));
    // @ts-ignore
    setLastKey(key);
  }

  return { state, lastKey };
}

