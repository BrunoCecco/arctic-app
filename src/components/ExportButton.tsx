import * as React from 'react';
import { useExport } from '../hooks/useExport';
import { RecordingSession } from '../types';
import { Dialogs } from '@nativescript/core';
import { ShareFile } from 'nativescript-share-file';

interface ExportButtonProps {
  session: RecordingSession;
}

export function ExportButton({ session }: ExportButtonProps) {
  const { isExporting, exportError, exportToGpx } = useExport();

  const handleExport = async () => {
    if (!session || isExporting) return;

    const filePath = await exportToGpx(session);

    const shareFile = new ShareFile();

    shareFile.open({
      path: filePath,
      intentTitle: 'Open text file with:', // optional Android
      rect: {
        // optional iPad
        x: 110,
        y: 110,
        width: 0,
        height: 0,
      },
      options: true, // optional iOS
      animated: true, // optional iOS
    });

    if (filePath) {
      await Dialogs.alert({
        title: 'Export Successful',
        message: `GPX file saved to:\n${filePath}`,
        okButtonText: 'OK',
      });
    } else if (exportError) {
      await Dialogs.alert({
        title: 'Export Failed',
        message: exportError,
        okButtonText: 'OK',
      });
    }
  };

  return (
    <button
      className={`p-2 rounded ${
        isExporting ? 'bg-gray-400' : 'bg-blue-500'
      } text-white`}
      onTap={handleExport}
      isEnabled={!isExporting && !!session}
    >
      {isExporting ? 'Exporting...' : 'Export GPX'}
    </button>
  );
}
