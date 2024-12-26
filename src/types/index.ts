export interface GpsPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface VoiceNote {
  id: string;
  startTime: number;
  duration: number;
  audioPath: string;
  location: GpsPoint;
}

export interface RecordingSession {
  id: string;
  startTime: number;
  endTime?: number;
  gpsPoints: GpsPoint[];
  voiceNotes: VoiceNote[];
  isActive: boolean;
}