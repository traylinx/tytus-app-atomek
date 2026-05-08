import type { HostClient } from '@tytus/host-api';
import { WorkbenchShell } from './workbench/components/WorkbenchShell';
import './workbench/workbench.css';

interface AppProps {
  host: HostClient;
}

export function App({ host }: AppProps) {
  return <WorkbenchShell host={host} />;
}
