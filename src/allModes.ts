import { Mode } from './data/primitives';
import CreateMode from './ui/modes/CreateMode';
import SolveMode from './ui/modes/SolveMode';

const allModes = new Map<Mode, React.NamedExoticComponent<object>>();

function register(mode: Mode, component: React.NamedExoticComponent<object>) {
  allModes.set(mode, component);
}

register(Mode.Create, CreateMode);
register(Mode.Solve, SolveMode);

export default allModes;
