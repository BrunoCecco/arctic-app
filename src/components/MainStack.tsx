import * as React from 'react';
import { BaseNavigationContainer } from '@react-navigation/core';
import {
  stackNavigatorFactory,
  tabViewNavigatorFactory,
} from 'react-nativescript-navigation';
import { ControlPanel } from './ControlPanel';
import { VoiceNoteList } from './VoiceNoteList';
import { Sessions } from './Sessions';
import { useSession } from '../hooks/useSession';

const TabNavigator = tabViewNavigatorFactory();
const StackNavigator = stackNavigatorFactory();

/* Main Stack Navigator */
export const MainStack = () => {
  const {
    session,
    starting,
    isActive,
    isRecording,
    duration,
    startSession,
    stopSession,
    resetSession,
  } = useSession();

  return (
    <BaseNavigationContainer>
      <StackNavigator.Navigator initialRouteName="Home">
        {/* Main Tab Navigator */}
        <StackNavigator.Screen name="Home" options={{ headerShown: false }}>
          {() => (
            <TabNavigator.Navigator initialRouteName="Control">
              <TabNavigator.Screen
                name="Control"
                options={{
                  title: 'Control Panel',
                }}
              >
                {(props) => (
                  <ControlPanel
                    {...props}
                    starting={starting}
                    isActive={isActive}
                    isRecording={isRecording}
                    duration={duration}
                    onStart={startSession}
                    onStop={stopSession}
                    onReset={resetSession}
                  />
                )}
              </TabNavigator.Screen>

              <TabNavigator.Screen
                name="Sessions"
                component={Sessions}
                options={{
                  title: 'Sessions',
                }}
              />
            </TabNavigator.Navigator>
          )}
        </StackNavigator.Screen>

        {/* Voice Note List Screen */}
        <StackNavigator.Screen
          name="VoiceNoteList"
          component={VoiceNoteList}
          options={{
            title: 'Voice Notes',
          }}
        />
      </StackNavigator.Navigator>
    </BaseNavigationContainer>
  );
};
