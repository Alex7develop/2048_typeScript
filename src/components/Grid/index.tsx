import style from './style.module.css';

// React
import { motion, AnimatePresence } from "framer-motion";

import { game } from '../../App';
import { ReactNode } from 'react';

interface GridProps {
  state: GameState;
  lastKey: ControlKey;
}

const Grid = ({ state, lastKey }: GridProps) => {
  const { merges } = game;
  return (
    <div className={style.grid}>
      {
        state.map((row, y) => row.map((cell, x) => (
          <div key={`cell-${x}:${y}`} className={style.cell} /> 
        )))
      }
      <AnimatePresence custom={{ lastKey, merges, state }}>
        { renderBlocks() }
      </AnimatePresence>
    </div>
  );

  function renderBlocks(): ReactNode {
    return state.flat().map((block, i, blocks) => {
      if (block === null) return null;

      const x = i % state.length;
      const y = Math.floor(i / state.length);
      
      const variants = {
        exit: ({ key, merges, state }
        : {
          key: ControlKey;
          merges: Map<string, string>;
          state: GameState;
        }) => {
          const mergedWithUuid = merges.get(block.uuid);
          const mergedWithIndex = blocks.findIndex(bl => bl?.uuid === mergedWithUuid);
          const mergedWith = blocks[mergedWithIndex];

          if (mergedWithIndex === -1) return ({
            opacity: 0,
          });
          const mergedWithX = mergedWithIndex % state.length;
          const mergedWithY = Math.floor(mergedWithIndex / state.length);
          console.log(block.uuid);
          console.log(mergedWith);
          console.log(mergedWithY, mergedWithY);
          return ({
            zIndex: 1,
            left: `${25*mergedWithX}%`,
            top: `${25*mergedWithY}%`,
            opacity: 0,
          });
        }
      }

      const wasMerged = [...merges.values()].indexOf(block.uuid) !== -1

      return (
        <motion.div 
          key={block.uuid} 
          className={`block block__${block.value.toString()}`}
          variants={variants}
          initial={{
            scale: 0,
            left: `${25*x}%`,
            top: `${25*y}%`,
          }}
          animate={{
            scale: 1,
            left: `${25*x}%`,
            top: `${25*y}%`,
            scale: wasMerged ? [1.2, 1] : 1,
          }}
          exit={"exit"}
        >
          <span className='block__value'>{block.value.toString()}</span>
          {/* <span className='block__uuid'>{block.uuid.slice(-5)}</span> */}
        </motion.div> 
      );
    });
  }
};

export default Grid;    
