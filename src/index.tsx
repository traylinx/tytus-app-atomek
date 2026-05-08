import type { AppBootEnv } from '@tytus/host-api';
import { App as RootApp } from './App';

export default function bootApp(env: AppBootEnv) {
  return function BootedApp() {
    return <RootApp host={env.host} />;
  };
}
