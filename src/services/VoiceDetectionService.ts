import { TNSRecorder } from 'nativescript-audio';
import {
  AudioRecorder,
  AudioRecorderOptions,
} from '@voicethread/nativescript-audio-recorder';
import { knownFolders, path, File, Folder } from '@nativescript/core';
import { GpsPoint, VoiceNote } from '~/types';
import { AudioService } from './AudioService';
import { LocationService } from './LocationService';

export class VoiceDetectionService {
  private static readonly AMPLITUDE_THRESHOLD = -50;
  private static readonly DETECTION_INTERVAL = 1000; // ms
  private static readonly RECORDING_SESSION_LENGTH = 10000;
  private recorder: AudioRecorder;
  private recordingPath: string;
  private audioService: AudioService;
  private recordingFolder: Folder;

  constructor() {
    // this.recorder = new TNSRecorder();
    this.recorder = new AudioRecorder();
    this.audioService = new AudioService();
    let timestamp = Date.now();
    this.recordingPath = `audio-session-${timestamp}.mp4`;
    this.recordingFolder = knownFolders.documents().getFolder('session-audio');
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  async startMonitoring(
    callback: (voiceNote: VoiceNote) => void,
    setIsRecording: (val: boolean) => void
  ): Promise<void> {
    let timestamp = Date.now();
    this.recordingPath = `monitoring-session-${timestamp}.mp4`;

    let recOptions: AudioRecorderOptions = {
      filename: path.join(
        knownFolders.documents().getFolder('session-audio').path,
        this.recordingPath
      ),
      metering: true,
      infoCallback: (infoObject) => {
        console.log('AudioRecorder infoCallback: ', JSON.stringify(infoObject));
      },
      errorCallback: (errorObject) => {
        console.error(
          'AudioRecorder errorCallback: ',
          JSON.stringify(errorObject)
        );
      },
    };
    try {
      this.recorder
        .record(recOptions)
        .then(() => {
          console.log('recording audio started');
          this.monitor(callback, setIsRecording).then(() => {
            console.log('monitoring for voice...');
          });
        })
        .catch((err) => {
          console.error(err, ': Error');
        });
    } catch (err) {
      alert(err?.message);
    }
  }

  private async monitor(
    callback: (voiceNote: VoiceNote) => void,
    setIsRecording: (val: boolean) => void
  ): Promise<void> {
    const monitorInterval = setInterval(async () => {
      const meterLevel = this.recorder.getMeters();
      if (meterLevel > VoiceDetectionService.AMPLITUDE_THRESHOLD) {
        setIsRecording(true);
        clearInterval(monitorInterval);
        await this.audioService.startRecording(
          callback,
          () => this.monitor(callback, setIsRecording),
          setIsRecording
        );
      }
    }, VoiceDetectionService.DETECTION_INTERVAL);
  }

  async stopMonitoring(): Promise<void> {
    await this.recorder.stop();
    const file = this.recordingFolder.getFile(this.recordingPath);
    const result = await file.remove();
  }
}
