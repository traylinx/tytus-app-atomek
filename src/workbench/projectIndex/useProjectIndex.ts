import { useCallback, useEffect, useRef, useState } from 'react';
import type { WorkbenchFile } from '../types';
import type { ProjectIndexOptions, ProjectIndexSnapshot } from './chunker';
import { createProjectIndexStore, type ProjectIndexStaleReport, type ProjectIndexStore } from './indexStore';
import { retrieveProjectContext, type ProjectIndexContextHit, type ProjectIndexRetrievalOptions } from './retrieval';

export type UseProjectIndexOptions = ProjectIndexOptions & {
  autoRefresh?: boolean;
};

export type UseProjectIndexResult = {
  snapshot: ProjectIndexSnapshot;
  staleReport: ProjectIndexStaleReport;
  isStale: boolean;
  refresh: (nextFiles?: readonly WorkbenchFile[]) => ProjectIndexSnapshot;
  update: (nextFiles?: readonly WorkbenchFile[]) => ProjectIndexSnapshot;
  retrieve: (query: string, retrievalOptions?: ProjectIndexRetrievalOptions) => ProjectIndexContextHit[];
};

export const useProjectIndex = (files: readonly WorkbenchFile[], options: UseProjectIndexOptions = {}): UseProjectIndexResult => {
  const { autoRefresh = false, ...indexOptions } = options;
  const filesRef = useRef(files);
  const storeRef = useRef<ProjectIndexStore | null>(null);
  if (!storeRef.current) storeRef.current = createProjectIndexStore(files, indexOptions);
  const [snapshot, setSnapshot] = useState<ProjectIndexSnapshot>(() => storeRef.current?.getSnapshot() ?? createProjectIndexStore(files, indexOptions).getSnapshot());

  filesRef.current = files;

  const refresh = useCallback((nextFiles: readonly WorkbenchFile[] = filesRef.current): ProjectIndexSnapshot => {
    const next = (storeRef.current ?? createProjectIndexStore([], indexOptions)).refresh(nextFiles, indexOptions);
    setSnapshot(next);
    return next;
  }, [indexOptions.maxFileBytes, indexOptions.maxChunkChars, indexOptions.chunkOverlapChars, indexOptions.maxChunksPerFile, indexOptions.includeDirty]);

  const update = useCallback((nextFiles: readonly WorkbenchFile[] = filesRef.current): ProjectIndexSnapshot => {
    const next = (storeRef.current ?? createProjectIndexStore([], indexOptions)).update(nextFiles, indexOptions);
    setSnapshot(next);
    return next;
  }, [refresh]);

  useEffect(() => {
    if (autoRefresh) refresh(files);
  }, [autoRefresh, files, refresh]);

  const staleReport = (storeRef.current ?? createProjectIndexStore([], indexOptions)).staleReport(files);

  const retrieve = useCallback((query: string, retrievalOptions: ProjectIndexRetrievalOptions = {}): ProjectIndexContextHit[] => {
    const store = storeRef.current ?? createProjectIndexStore([], indexOptions);
    return retrieveProjectContext(store.getSnapshot(), query, retrievalOptions, store.staleReport(filesRef.current));
  }, []);

  return { snapshot, staleReport, isStale: staleReport.stale, refresh, update, retrieve };
};
