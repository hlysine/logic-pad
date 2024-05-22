// This is a temporary workaround for a bug in Bun that prevents the build process from exiting properly

import { Plugin } from 'vite';

export function stopVitePlugin(): Plugin {
  return {
    name: 'stop-vite-plugin',
    enforce: 'post',
    apply: 'build',
    closeBundle() {
      console.log('Exiting!');
      process.exit(0);
    },
  };
}
