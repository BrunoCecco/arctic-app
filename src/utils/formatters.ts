export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
};

const padZero = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const formatCoordinates = (lat: number, lon: number): string => {
  return `${lat.toFixed(6)}°, ${lon.toFixed(6)}°`;
};