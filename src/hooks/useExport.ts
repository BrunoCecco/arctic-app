import { useState, useCallback } from 'react';
import { ExportService } from '../services/export/ExportService';
import { RecordingSession } from '../types';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const exportService = new ExportService();

  const exportToGpx = useCallback(async (session: RecordingSession): Promise<string | null> => {
    try {
      setIsExporting(true);
      setExportError(null);
      const filePath = await exportService.exportGpx(session);
      return filePath;
    } catch (error) {
      setExportError('Failed to export GPX file');
      return null;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const getExportedFiles = useCallback(async (): Promise<string[]> => {
    return await exportService.getExportedFiles();
  }, []);

  const deleteExportedFile = useCallback(async (filePath: string): Promise<boolean> => {
    return await exportService.deleteExportedFile(filePath);
  }, []);

  return {
    isExporting,
    exportError,
    exportToGpx,
    getExportedFiles,
    deleteExportedFile
  };
};