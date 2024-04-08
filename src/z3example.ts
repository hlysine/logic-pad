import { init } from 'z3-solver';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const { Context } = await init();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { Solver, Int, And } = Context('main');

  const x = Int.const('x');

  const solver = new Solver();
  solver.add(And(x.ge(0), x.le(9)));
  console.log(await solver.check());
})();
