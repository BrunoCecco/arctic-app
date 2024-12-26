import {
  isEnabled,
  getCurrentLocation,
  enableLocationRequest,
  watchLocation,
  clearWatch,
} from '@nativescript/geolocation';
import { CoreTypes } from '@nativescript/core';
import { GpsPoint } from '../types';

export class LocationService {
  private isTracking: boolean = false;
  private watchId: number;
  private onLocationUpdate: (location: GpsPoint) => void;

  constructor() {
    this.watchId = null;
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const hasPermission = await enableLocationRequest();
      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<GpsPoint | null> {
    try {
      const location = await getCurrentLocation({
        desiredAccuracy: CoreTypes.Accuracy.high,
        maximumAge: 5000,
        timeout: 20000,
      });

      return {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  startTracking(callback: (location: GpsPoint) => void): void {
    this.onLocationUpdate = callback;
    this.isTracking = true;

    watchLocation(
      (location) => {
        const gpsPoint: GpsPoint = {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: Date.now(),
        };
        this.onLocationUpdate(gpsPoint);
      },
      (error) => {
        console.error('Location tracking error: ', JSON.stringify(error));
      },
      {
        desiredAccuracy: CoreTypes.Accuracy.high,
        updateDistance: 0,
        minimumUpdateTime: 1000, // Update every second
      }
    );
  }

  stopTracking(): void {
    if (this.isTracking) {
      clearWatch(this.watchId);
      this.isTracking = false;
    }
  }

  isEnabled(): Promise<boolean> {
    return isEnabled();
  }
}
