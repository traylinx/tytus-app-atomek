import type { HostClient } from '@tytus/host-api';
import { WorkbenchShell } from './workbench/components/WorkbenchShell';
import './workbench/workbench.css';

interface ForgeProps {
  host: HostClient;
}

export function Forge({ host }: ForgeProps) {
  return <WorkbenchShell host={host} />;
}
