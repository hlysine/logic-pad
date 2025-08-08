import { NavigateOptions } from '@tanstack/react-router';
import { router } from '../main';

class DeferredRedirect {
  set(location: NavigateOptions) {
    localStorage.setItem('deferredRedirect', JSON.stringify(location));
  }

  async setAndNavigate(
    currentLocation: NavigateOptions,
    destination: NavigateOptions
  ) {
    this.set(currentLocation);
    await router.navigate(destination);
  }

  async execute(): Promise<boolean> {
    const serialized = localStorage.getItem('deferredRedirect');
    if (!serialized) return false;
    const location = JSON.parse(serialized) as NavigateOptions;
    try {
      await router.navigate(location);
      return true;
    } catch {
      return false;
    }
  }
}

export default new DeferredRedirect();
