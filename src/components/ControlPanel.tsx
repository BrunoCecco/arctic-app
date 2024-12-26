import * as React from 'react';
import { StyleSheet } from 'react-nativescript';
import { Dialogs } from '@nativescript/core';
import { formatDuration } from '../utils/formatters';
import { RouteProp } from '@react-navigation/core';
import { FrameNavigationProp } from 'react-nativescript-navigation';

interface ControlPanelProps {
  route: RouteProp<any, string>;
  navigation: FrameNavigationProp<any, any>;
  isActive: boolean;
  isRecording: boolean;
  starting: boolean;
  duration: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function ControlPanel({
  starting,
  isActive,
  isRecording,
  duration,
  onStart,
  onStop,
  onReset,
}: ControlPanelProps) {
  const handleReset = async () => {
    const result = await Dialogs.confirm({
      title: 'Reset Session',
      message:
        'Are you sure you want to reset? All recorded data will be lost.',
      okButtonText: 'Reset',
      cancelButtonText: 'Cancel',
    });

    if (result) {
      onReset();
    }
  };

  return (
    <gridLayout rows="*, auto" className="bg-slate-900 p-6">
      {/* Main content */}
      <stackLayout row={0} className="items-center justify-center">
        {/* Timer display */}
        <label className="text-5xl font-bold mb-8 text-white">
          {formatDuration(duration)}
        </label>

        {/* Large circular button */}
        <gridLayout
          className={`rounded-full w-48 h-48 ${
            isActive
              ? 'bg-red-500 active:bg-red-600'
              : starting
              ? 'bg-orange-500'
              : 'bg-emerald-500 active:bg-emerald-600'
          } flex items-center justify-center`}
          onTap={isActive ? onStop : onStart}
        >
          <label className="text-6xl h-full text-center w-full m-auto font-bold text-white">
            {isActive ? '■' : starting ? '...' : '▶'}
          </label>
        </gridLayout>

        <label
          className={`mt-6 text-lg ${
            isActive ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          {isRecording
            ? 'Recording in progress'
            : isActive
            ? 'Listening...'
            : 'Ready to start'}
        </label>
      </stackLayout>

      {/* Bottom actions */}
      <stackLayout row={1} className="mt-4">
        <gridLayout columns="*, *" className="gap-4">
          <button
            col={0}
            className="p-4 rounded-xl bg-slate-700 active:bg-slate-600 text-white"
            onTap={handleReset}
          >
            Reset
          </button>
        </gridLayout>
      </stackLayout>
    </gridLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
