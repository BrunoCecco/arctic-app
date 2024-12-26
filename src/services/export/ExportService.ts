import { File, Folder, knownFolders, path } from '@nativescript/core';
import { RecordingSession } from '../../types';
import { generateGpx } from '../../utils/gpx/generator';

export class ExportService {
  private exportFolder: Folder;

  constructor() {
    this.exportFolder = knownFolders.documents().getFolder('exports');
  }

  async exportGpx(session: RecordingSession): Promise<string> {
    try {
      const gpxContent = generateGpx(session.gpsPoints, session.voiceNotes);
      const fileName = `session_${session.id}_${new Date().toISOString()}.gpx`;
      const filePath = path.join(this.exportFolder.path, fileName);
      
      const file = File.fromPath(filePath);
      await file.writeText(gpxContent);
      
      return filePath;
    } catch (error) {
      console.error('Error exporting GPX:', error);
      throw new Error('Failed to export GPX file');
    }
  }

  async getExportedFiles(): Promise<string[]> {
    try {
      return this.exportFolder
        .getEntitiesSync()
        .filter(entity => entity instanceof File && entity.name.endsWith('.gpx'))
        .map(file => file.path);
    } catch (error) {
      console.error('Error getting exported files:', error);
      return [];
    }
  }

  async deleteExportedFile(filePath: string): Promise<boolean> {
    try {
      const file = File.fromPath(filePath);
      await file.remove();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}