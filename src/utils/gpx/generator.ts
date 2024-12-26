import { GpsPoint, VoiceNote } from '../../types';
import {
  gpxHeader,
  gpxFooter,
  createTrackPoint,
  createWaypoint,
} from './templates';

export const generateGpx = (
  points: GpsPoint[],
  voiceNotes: VoiceNote[]
): string => {
  const startTime = new Date(points[0]?.timestamp || Date.now()).toISOString();

  const trackPoints = points
    .map((point) =>
      createTrackPoint(
        point.latitude,
        point.longitude,
        new Date(point.timestamp).toISOString()
      )
    )
    .join('');

  const waypoints = voiceNotes
    .map((note) =>
      createWaypoint(
        note.location.latitude,
        note.location.longitude,
        'Voice Note',
        `Duration: ${note.duration}s`,
        new Date(note.startTime).toISOString()
      )
    )
    .join('');

  return gpxHeader(startTime) + trackPoints + gpxFooter(waypoints);
};
