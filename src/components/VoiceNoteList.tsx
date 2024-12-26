import * as React from 'react';
import { formatDuration, formatCoordinates } from '../utils/formatters';
import { AudioService } from '../services/AudioService';
import { VoiceNote } from '../types';

export function VoiceNoteList({ route }) {
  const { notes } = route.params;
  const [playingNoteId, setPlayingNoteId] = React.useState<string | null>(null);
  const audioService = new AudioService();

  const handlePlayNote = async (note: VoiceNote) => {
    if (playingNoteId === note.id) {
      await audioService.pausePlayback();
      setPlayingNoteId(null);
    } else {
      if (playingNoteId) {
        await audioService.stopPlayback();
      }
      await audioService.playNote(note.audioPath);
      setPlayingNoteId(note.id);
    }
  };

  return (
    <scrollView className="bg-gray-100">
      <stackLayout className="p-4">
        {notes.length === 0 ? (
          <label className="text-center text-gray-500 p-4">
            No voice notes in this session
          </label>
        ) : (
          notes.map((note) => (
            <gridLayout
              key={note.id}
              columns="*, auto"
              className="bg-white p-4 rounded-lg shadow-md mb-2"
            >
              <stackLayout col={0} className="mr-4">
                <label className="font-bold text-gray-800">
                  {new Date(note.startTime).toLocaleTimeString()}
                </label>
                <label className="text-sm text-gray-600">
                  {formatCoordinates(
                    note.location.latitude,
                    note.location.longitude
                  )}
                </label>
                <label className="text-sm text-gray-600">
                  Duration: {formatDuration(note.duration)}
                </label>
              </stackLayout>
              <button
                col={1}
                className={`p-4 rounded-full ${
                  playingNoteId === note.id
                    ? 'bg-red-500 active:bg-red-600'
                    : 'bg-blue-500 active:bg-blue-600'
                } text-white`}
                onTap={() => handlePlayNote(note)}
              >
                {playingNoteId === note.id ? '⏸️' : '▶️'}
              </button>
            </gridLayout>
          ))
        )}
      </stackLayout>
    </scrollView>
  );
}