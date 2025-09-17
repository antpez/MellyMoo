import { KeyboardDismissView } from '@/src/components/ui/KeyboardDismissView';
import { useAppState, useProgressionStore } from '@/src/state';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { Button, Divider, List, Switch, useTheme } from 'react-native-paper';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const isDark = colorScheme === 'dark';
  const { resetProgression, completedLevels } = useProgressionStore();
  const [isResetting, setIsResetting] = useState(false);

  const {
    reduceMotion,
    colorAssist,
    longPressMode,
    setReduceMotion,
    setColorAssist,
    setLongPressMode,
    musicVolume,
    sfxVolume,
    hapticsEnabled,
    setMusicVolume,
    setSfxVolume,
    setHapticsEnabled,
    telemetryOptIn,
    setTelemetryOptIn,
  } = useAppState();

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your game progress? This will delete all completed levels and start you from the beginning. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setIsResetting(true);
            resetProgression();
            setTimeout(() => {
              setIsResetting(false);
              Alert.alert("Progress Reset", "Your game progress has been reset. You can now start fresh from Level 1.");
            }, 500);
          }
        }
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/mellymoo_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <KeyboardDismissView style={{ flex: 1 }}>
        <ScrollView>
          <List.Section>
        <List.Subheader>Audio</List.Subheader>
        <List.Item
          title={`Music: ${musicVolume}`}
          right={() => (
            <Slider
              style={{ width: 180 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={musicVolume}
              onValueChange={(v) => setMusicVolume(Math.round(v))}
            />
          )}
        />
        <List.Item
          title={`SFX: ${sfxVolume}`}
          right={() => (
            <Slider
              style={{ width: 180 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={sfxVolume}
              onValueChange={(v) => setSfxVolume(Math.round(v))}
            />
          )}
        />
        <List.Item
          title="Haptics"
          right={() => (
            <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
          )}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Accessibility</List.Subheader>
        <List.Item
          title="Reduce Motion"
          right={() => (
            <Switch value={reduceMotion} onValueChange={setReduceMotion} />
          )}
        />
        <List.Item
          title="Color Assist"
          right={() => (
            <Switch value={colorAssist} onValueChange={setColorAssist} />
          )}
        />
        <List.Item
          title="Long-press Mode"
          right={() => (
            <Switch value={longPressMode} onValueChange={setLongPressMode} />
          )}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Privacy</List.Subheader>
        <List.Item
          title="Analytics (Local Only)"
          right={() => (
            <Switch value={telemetryOptIn} onValueChange={setTelemetryOptIn} />
          )}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Manage Children"
          description="Add, edit, or remove child profiles"
          left={(props) => <List.Icon {...props} icon="account-group" />}
          right={() => (
            <Button 
              mode="outlined" 
              onPress={() => router.push('/children')}
              buttonColor={isDark ? '#2D1B1B' : '#FFF5F5'}
              textColor="#FF6F61"
              compact
            >
              Manage
            </Button>
          )}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Game Progress</List.Subheader>
        <List.Item
          title={`Completed Levels: ${completedLevels.length}/20`}
          description="Your current progress through the game"
        />
        {completedLevels.length > 0 && (
          <List.Item
            title="Reset Progress"
            description="Start over from Level 1"
            right={() => (
              <Button 
                mode="outlined" 
                onPress={handleResetProgress}
                disabled={isResetting}
                buttonColor={isDark ? '#2D1B1B' : '#FFF5F5'}
                textColor="#FF6F61"
                compact
              >
                {isResetting ? 'Resetting...' : 'Reset'}
              </Button>
            )}
          />
        )}
      </List.Section>
        </ScrollView>
      </KeyboardDismissView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 120,
    maxWidth: '80%',
  },
});
