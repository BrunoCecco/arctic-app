import {
  Folder,
  knownFolders,
  File,
  path,
  FileSystemEntity,
} from '@nativescript/core';
import { RecordingSession } from '../types';

export class StorageService {
  private dataFolder: Folder;
  private audioFolder: Folder;

  constructor() {
    this.dataFolder = knownFolders.documents().getFolder('data');
    this.audioFolder = knownFolders.documents().getFolder('audio');
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  async saveSession(session: RecordingSession): Promise<void> {
    const filePath = path.join(
      this.dataFolder.path,
      `session_${session.id}.json`
    );
    const file = File.fromPath(filePath);
    await file.writeText(JSON.stringify(session));
    alert('File saved: ' + file.name + ': ' + file.path);
  }

  async loadSessions(): Promise<RecordingSession[]> {
    const files = this.dataFolder.getEntitiesSync();

    // Filter session files and create an array of promises
    const sessionPromises = files
      .filter(
        (file) => file instanceof File && file.name.startsWith('session_')
      )
      .map((file) =>
        (file as File).readText().then((content) => {
          try {
            return JSON.parse(content);
          } catch (error) {
            return null;
          }
        })
      );

    // Resolve all promises in parallel
    const sessions = await Promise.all(sessionPromises);

    // Sort sessions by endTime in descending order
    return sessions
      .filter((session) => session != null)
      .sort((a, b) => b.endTime - a.endTime);
  }

  getAudioFilePath(noteId: string): string {
    return path.join(this.audioFolder.path, `note_${noteId}.m4a`);
  }
}
