import type { AppBootEnv } from '@tytus/host-api';
import { Forge } from './Forge';

export default function bootForge(env: AppBootEnv) {
  return function TytusForgeApp() {
    return <Forge host={env.host} />;
  };
}
