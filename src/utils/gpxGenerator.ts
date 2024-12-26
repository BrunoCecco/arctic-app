export const generateGpx = (session: RecordingSession): string => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Arctic Voice GPS"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <time>${new Date(session.startTime).toISOString()}</time>
  </metadata>
  <trk>
    <name>Arctic Voice Recording Session</name>
    <trkseg>`;

  const points = session.gpsPoints.map(point => `
    <trkpt lat="${point.latitude}" lon="${point.longitude}">
      <ele>0</ele>
      <time>${new Date(point.timestamp).toISOString()}</time>
    </trkpt>`).join('');

  const waypoints = session.voiceNotes.map(note => `
  <wpt lat="${note.location.latitude}" lon="${note.location.longitude}">
    <name>Voice Note</name>
    <desc>Duration: ${note.duration}s</desc>
    <time>${new Date(note.startTime).toISOString()}</time>
  </wpt>`).join('');

  const footer = `
    </trkseg>
  </trk>${waypoints}
</gpx>`;

  return header + points + footer;
};