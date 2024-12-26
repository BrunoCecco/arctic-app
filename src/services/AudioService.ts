import { TNSPlayer, TNSRecorder } from 'nativescript-audio';
import { knownFolders, path } from '@nativescript/core';
import {
  AudioRecorder,
  AudioRecorderOptions,
} from '@voicethread/nativescript-audio-recorder';
import { GpsPoint, VoiceNote } from '~/types';
import { LocationService } from './LocationService';
import { Haptics, HapticNotificationType, HapticImpactType } from "@nativescript/haptics";

export class AudioService {
  private recorder: AudioRecorder;
  private player: TNSPlayer;
  private clickSound: TNSPlayer;
  private recordingPath: string;
  private locationService: LocationService;

  constructor() {
    this.recorder = new AudioRecorder();
    this.player = new TNSPlayer();
    this.clickSound = new TNSPlayer();
    this.locationService = new LocationService();
    this.recordingPath;
  }

  async startRecording(
    callback: (voiceNote: VoiceNote) => void,
    restartMonitoring: () => void,
    setIsRecording: (val: boolean) => void
  ): Promise<void> {
    let timestamp = Date.now();
    this.recordingPath = `voice-note-${timestamp}.mp4`;

    let recOptions: AudioRecorderOptions = {
      filename: path.join(
        knownFolders.documents().getFolder('audio').path,
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
          Haptics.impact(HapticImpactType.HEAVY);
          console.log('recording audio started');
          setTimeout(async () => {
            console.log('STOPPPING');
            await this.stopRecording(callback, restartMonitoring);
            setIsRecording(false);
            console.log('STOPPED RECORDING');
          }, 2000);
        })
        .catch((err) => {
          console.error(err, ': Error');
        });
    } catch (err) {
      alert(err?.message);
    }
  }

  async stopRecording(
    callback: (voiceNote: VoiceNote) => void,
    restartMonitoring: () => void
  ): Promise<string> {
    const File = await this.recorder.stop();

    let recordingLocation = await this.locationService.getCurrentLocation();
    let startTime = Date.now();
    const filePath = File.path;
    console.log(filePath, 'FILEPATH');
    const voiceNote = this.saveRecording(
      filePath,
      startTime,
      recordingLocation
    );
    console.log(voiceNote, ' VOICENOTE');
    callback(voiceNote);
    restartMonitoring();
    return File.path;
  }

  private saveRecording(
    path: string,
    startTime: number,
    location: GpsPoint
  ): VoiceNote {
    return {
      id: startTime.toString(),
      startTime: startTime,
      duration: 10,
      audioPath: path,
      location: location,
    };
  }

  async playFeedbackClick(): Promise<void> {
    await this.clickSound.play();
  }

  async playNote(filePath: string): Promise<void> {
    await this.player.initFromFile({
      audioFile: filePath,
      loop: false,
    });
    await this.player.play();
  }

  async pausePlayback(): Promise<void> {
    await this.player.pause();
  }

  async stopPlayback(): Promise<void> {
    await this.player.dispose();
  }

  async detectVoiceActivity(): Promise<boolean> {
    // Implement voice activity detection
    // This would need to be implemented with a more sophisticated
    // audio analysis library or native module
    return false;
  }
}
