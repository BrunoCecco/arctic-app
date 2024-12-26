import * as React from 'react';
import { SessionCard } from './SessionCard';
import { RecordingSession } from '../types';
import { StorageService } from '../services/StorageService';

export function Sessions({ navigation }) {
  const storageService = new StorageService();
  const [sessions, setSessions] = React.useState<RecordingSession[]>();

  React.useEffect(() => {
    // Initial fetch
    fetchSessions();

    // Refresh every 5 seconds
    // setInterval(() => await fetchSessions(), 1000);
  }, []);

  const fetchSessions = async () => {
    const storedSessions = await storageService.loadSessions();
    console.log('SESSIONS', storedSessions);
    setSessions(storedSessions);
  };

  return (
    <scrollView className="bg-gray-100">
      <stackLayout className="p-4">
        {!sessions || sessions.length === 0 ? (
          <stackLayout>
            <label className="text-center text-gray-500 p-4">
              No sessions recorded yet
            </label>
            <button onTap={async () => await fetchSessions()}>
              Fetch Sessions
            </button>
          </stackLayout>
        ) : (
          sessions.map((session, index) => (
            <SessionCard
              key={session.id}
              session={session}
              navigation={navigation}
            />
          ))
        )}
      </stackLayout>
    </scrollView>
  );
}
