import { memo } from 'react';

export default memo(function Roadmap() {
  return (
    <ul className="menu menu-vertical flex-nowrap bg-base-200 rounded-box overflow-y-auto overflow-x-visible basis-0 flex-1 justify-self-stretch">
      <li className="opacity-50">
        <a>Implement puzzle grid</a>
      </li>
      <li className="opacity-50">
        <a>Implement click and drag mouse input</a>
      </li>
      <li className="opacity-50">
        <a>Implement merged tiles</a>
      </li>
      <li className="opacity-50">
        <a>Implement rules UI</a>
      </li>
      <li className="opacity-50">
        <a>Implement color themes</a>
      </li>
      <li>
        <details open>
          <summary>Add rules and symbols</summary>
          <ul>
            <li className="opacity-50">
              <a>Area number</a>
            </li>
            <li className="opacity-50">
              <a>Letter</a>
            </li>
            <li className="opacity-50">
              <a>Don&#39;t make this pattern</a>
            </li>
            <li className="opacity-50">
              <a>Complete the pattern</a>
            </li>
            <li className="opacity-50">
              <a>Connect all ___ cells</a>
            </li>
            <li className="opacity-50">
              <a>Underclued grid</a>
            </li>
            <li className="opacity-50">
              <a>Viewpoint number</a>
            </li>
            <li>
              <a>Dart number</a>
            </li>
            <li>
              <a>Lotus</a>
            </li>
            <li>
              <a>Spiral</a>
            </li>
            <li>
              <a>All ___ regions have area #</a>
            </li>
            <li>
              <a>Exactly # symbols per ___ region</a>
            </li>
          </ul>
        </details>
      </li>
      <li className="opacity-50">
        <a>Implement win confirmation</a>
      </li>
      <li className="opacity-50">
        <a>Add undo and restart</a>
      </li>
      <li>
        <a>Add flood painting</a>
      </li>
      <li>
        <a>Add tile counting by holding Ctrl</a>
      </li>
      <li>
        <a>Implement puzzle serialization</a>
      </li>
      <li>
        <details open>
          <summary>Optimizations</summary>
          <ul>
            <li>
              <a>Optimize merged cells</a>
            </li>
            <li className="opacity-50">
              <a>Add transitions to laggy buttons</a>
            </li>
            <li className="opacity-50">
              <a>Memoize components</a>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <details open>
          <summary>Puzzle editor</summary>
          <ul>
            <li>
              <a>Add color, fix and merge tools</a>
            </li>
            <li>
              <a>Add a tool for each symbol type</a>
            </li>
            <li>
              <a>Hide tools behind search bar</a>
            </li>
            <li>
              <a>Add configurations for each rule</a>
            </li>
            <li>
              <a>Hide rules behind search bar</a>
            </li>
            <li>
              <a>Add puzzle name and author fields</a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );
});
