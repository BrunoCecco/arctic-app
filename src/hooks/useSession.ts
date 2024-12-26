import { useState, useCallback, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { LocationService } from '../services/LocationService';
import { VoiceDetectionService } from '../services/VoiceDetectionService';
import { RecordingSession, VoiceNote } from '../types';
import { useExport } from './useExport';
import { Dialogs } from '@nativescript/core';

export const useSession = () => {
  const [session, setSession] = useState<RecordingSession>(null);
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [starting, setStarting] = useState(false);

  const storageService = new StorageService();
  const locationService = new LocationService();
  const voiceDetectionService = new VoiceDetectionService();

  const { isExporting, exportError, exportToGpx } = useExport();

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startSession = useCallback(async () => {
    try {
      setStarting(true);

      const hasPermission = await locationService.requestPermissions();
      if (!hasPermission) {
        console.error('Location permissions not granted');
        alert(
          'No location service permissions - go to settings to change this'
        );
        setStarting(false);
        return false;
      }

      const isLocationEnabled = await locationService.isEnabled();
      if (!isLocationEnabled) {
        console.error('Location services are not enabled');
        setStarting(false);
        return false;
      }

      const initialLocation = await locationService.getCurrentLocation();
      console.log('INITIAL LOCATION: ', initialLocation);
      if (!initialLocation) {
        console.error('Could not get initial location');
        setStarting(false);
        return false;
      }

      const newSession: RecordingSession = {
        id: Date.now().toString(),
        startTime: Date.now(),
        gpsPoints: [initialLocation],
        voiceNotes: [],
        isActive: true,
      };

      setSession(newSession);
      setIsActive(true);
      setDuration(0);

      await voiceDetectionService.startMonitoring((voiceNote: VoiceNote) => {
        console.log('NEW VOICE NOTE', voiceNote);
        setSession((prev) => ({
          ...prev,
          voiceNotes: [...prev.voiceNotes, voiceNote],
        }));
      }, setIsRecording);

      locationService.startTracking((location) => {
        setSession((prev) => ({
          ...prev,
          gpsPoints: [...prev.gpsPoints, location],
        }));
      });

      setStarting(false);
      return true;
    } catch (error) {
      console.error('Error starting session:', error);
      setStarting(false);
      return false;
    }
  }, []);

  const stopSession = useCallback(async () => {
    try {
      setIsActive(false);
      locationService.stopTracking();
      voiceDetectionService.stopMonitoring();

      console.log('STOPPED: \n' + JSON.stringify(session));

      const updatedSession = {
        ...session,
        endTime: Date.now(),
        isActive: false,
      };

      const filePath = await exportToGpx(session);

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

      await storageService.saveSession(updatedSession);
      setSession(updatedSession);
    } catch (error) {
      console.error('Error stopping session:', JSON.stringify(error));
    }
  }, [session]);

  const resetSession = useCallback(async () => {
    if (isActive) {
      await stopSession();
    }
    setSession(null);
    setDuration(0);
  }, [isActive, stopSession]);

  return {
    session,
    isActive,
    isRecording,
    starting,
    duration,
    startSession,
    stopSession,
    resetSession,
  };
};
