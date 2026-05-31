import type { HostClient } from '@tytus/host-api';
import { WorkbenchShell } from './workbench/components/WorkbenchShell';
import { AtomekI18nProvider } from './i18n';
import './workbench/workbench.css';

interface AppProps {
  host: HostClient;
}

export function App({ host }: AppProps) {
  return (
    <AtomekI18nProvider host={host}>
      <WorkbenchShell host={host} />
    </AtomekI18nProvider>
  );
}
