export const gpxHeader = (startTime: string) => `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Arctic Voice GPS"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <time>${startTime}</time>
  </metadata>
  <trk>
    <name>Arctic Voice Recording Session</name>
    <trkseg>`;

export const gpxFooter = (waypoints: string) => `
    </trkseg>
  </trk>${waypoints}
</gpx>`;

export const createTrackPoint = (latitude: number, longitude: number, timestamp: string) => `
    <trkpt lat="${latitude}" lon="${longitude}">
      <ele>0</ele>
      <time>${timestamp}</time>
    </trkpt>`;

export const createWaypoint = (latitude: number, longitude: number, name: string, description: string, timestamp: string) => `
  <wpt lat="${latitude}" lon="${longitude}">
    <name>${name}</name>
    <desc>${description}</desc>
    <time>${timestamp}</time>
  </wpt>`;