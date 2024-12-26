import * as React from 'react';
import { formatDuration } from '../utils/formatters';
import { ExportButton } from './ExportButton';
import { RecordingSession } from '../types';
import { NavigationProp } from '@react-navigation/core';

interface SessionCardProps {
  session: RecordingSession;
  navigation: NavigationProp<any>;
}

export function SessionCard({ session, navigation }: SessionCardProps) {
  const getDuration = (session: RecordingSession) =>
    session.endTime
      ? Math.floor((session.endTime - session.startTime) / 1000)
      : 0;

  return (
    <stackLayout className="bg-white m-2 p-4 rounded-lg shadow-md">
      {/* Session Date */}
      <label className="text-lg font-bold text-gray-800 mb-2">
        {new Date(session.startTime).toLocaleDateString()}
      </label>

      {/* Time */}
      <label className="text-gray-600">
        {new Date(session.startTime).toLocaleTimeString()}
      </label>

      {/* Duration */}
      <label className="text-right text-gray-600">
        {formatDuration(getDuration(session))}
      </label>

      {/* Voice Notes Count */}
      <label className="text-gray-600 mt-2">
        Voice Notes: {session.voiceNotes.length}
      </label>

      {/* Action Buttons */}
      <stackLayout className="mt-4">
        <button
          className="bg-blue-500 text-white p-2 rounded-lg active:bg-blue-600"
          onTap={() =>
            navigation.navigate('VoiceNoteList', { notes: session.voiceNotes })
          }
        >
          View Notes
        </button>
        <ExportButton session={session} />
      </stackLayout>
    </stackLayout>
  );
}
