import { memo } from 'react';
import { useGrid } from '../GridContext';
import Difficulty from './Difficulty';
import { State } from '../../data/primitives';

export default memo(function Metadata() {
  const { metadata, state } = useGrid();

  function shuffle(text: string) {
    var shuffled = text.split('').sort(function(){return 0.5-Math.random()}).join('');
    return shuffled;
  }

  return (
    <div className="flex flex-col gap-4 text-neutral-content">
      <svg style={{
        visibility: 'hidden',
        position: 'absolute'
      }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
            <filter id="instagram">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />    
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
        </defs>
    </svg>

      <Difficulty value={metadata.difficulty} />
      <h1 className="text-4xl">{metadata.title}</h1>
      <div className="flex flex-col gap-2">
        {state.final !== State.Satisfied && (
          <p className='mb-4'>Complete the puzzle to win, and reveal the text that's hidden below.</p>
        )}
        {metadata.description.split('{BR}').map((text) => (
          <p className="pointer-events-none text-sm" style={state.final === State.Satisfied ? {} : {
            display: 'inline',
            width: 'fit-content',
            padding: '4px 6px',
            lineHeight: 1.4,
            color: "#0d281f",
            backgroundColor: "#0d281f",
            borderRadius: '4px',
            boxDecorationBreak: 'clone',
            filter: "url('#instagram')"
          }}>{state.final === State.Satisfied ? text : shuffle(text)}</p>
        ))}
      </div>
    </div>
  );
});
