import { ObjectiveProgress } from '@/src/state/gameplay.slice';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

interface LevelCompletionCardProps {
  objectives: ObjectiveProgress;
  onContinue: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export function LevelCompletionCard({ 
  objectives, 
  onContinue, 
  onReplay, 
  onLevelSelect 
}: LevelCompletionCardProps) {
  const colorScheme = useColorScheme();
  const paperTheme = useTheme();
  const isDark = colorScheme === 'dark';

  const dynamicStyles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    card: {
      margin: 20,
      maxWidth: 400,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 20,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    title: {
      textAlign: 'center',
      marginBottom: 16,
      color: isDark ? '#FFFFFF' : '#333333',
    },
    objectiveItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginVertical: 4,
      backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA',
      borderRadius: 12,
    },
    objectiveText: {
      flex: 1,
      color: isDark ? '#CCCCCC' : '#666666',
    },
    objectiveProgress: {
      color: isDark ? '#FFFFFF' : '#333333',
      fontWeight: 'bold',
    },
    completedText: {
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });

  const isPrimaryCompleted = objectives.primary.completed;
  const isSecondaryCompleted = !objectives.secondary || objectives.secondary.completed;
  const allObjectivesCompleted = isPrimaryCompleted && isSecondaryCompleted;

  return (
    <View style={dynamicStyles.overlay}>
      <Card style={dynamicStyles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={dynamicStyles.title}>
            {allObjectivesCompleted ? '🎉 Level Complete!' : '📋 Objectives Progress'}
          </Text>
          
          {/* Primary Objective */}
          <View style={dynamicStyles.objectiveItem}>
            <Text style={dynamicStyles.objectiveText}>
              {objectives.primary.description}
            </Text>
            <Text style={[
              dynamicStyles.objectiveProgress,
              isPrimaryCompleted && dynamicStyles.completedText
            ]}>
              {objectives.primary.current}/{objectives.primary.target}
              {isPrimaryCompleted && ' ✓'}
            </Text>
          </View>

          {/* Secondary Objective */}
          {objectives.secondary && (
            <View style={dynamicStyles.objectiveItem}>
              <Text style={dynamicStyles.objectiveText}>
                {objectives.secondary.description}
              </Text>
              <Text style={[
                dynamicStyles.objectiveProgress,
                isSecondaryCompleted && dynamicStyles.completedText
              ]}>
                {objectives.secondary.current}/{objectives.secondary.target}
                {isSecondaryCompleted && ' ✓'}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={dynamicStyles.buttonContainer}>
            {allObjectivesCompleted ? (
              <>
                <Button 
                  mode="contained" 
                  onPress={onContinue}
                  style={dynamicStyles.button}
                  buttonColor="#4CAF50"
                >
                  Continue
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={onReplay}
                  style={dynamicStyles.button}
                >
                  Replay
                </Button>
              </>
            ) : (
              <>
                <Button 
                  mode="contained" 
                  onPress={onReplay}
                  style={dynamicStyles.button}
                >
                  Keep Playing
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={onLevelSelect}
                  style={dynamicStyles.button}
                >
                  Level Select
                </Button>
              </>
            )}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}
