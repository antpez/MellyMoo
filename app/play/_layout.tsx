import { Stack } from 'expo-router';
import React from 'react';

export default function PlayLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Play Setup',
          gestureEnabled: true, // Allow swipe back on setup
        }} 
      />
      <Stack.Screen 
        name="setup" 
        options={{ 
          title: 'Play Setup',
          gestureEnabled: true, // Allow swipe back on setup
        }} 
      />
      <Stack.Screen 
        name="gameplay" 
        options={{ 
          title: 'Gameplay',
          gestureEnabled: false, // Disable swipe-to-go-back during gameplay
          headerBackVisible: false, // Hide back button to prevent accidental navigation
          gestureDirection: 'horizontal', // Ensure we're targeting horizontal swipes
        }} 
      />
      <Stack.Screen 
        name="results" 
        options={{ 
          title: 'Results',
          gestureEnabled: true, // Allow swipe back on results
        }} 
      />
      <Stack.Screen 
        name="reward-reveal" 
        options={{ 
          title: 'Reward',
          gestureEnabled: true, // Allow swipe back on reward reveal
        }} 
      />
    </Stack>
  );
}


