import { KeyboardDismissView } from '@/src/components/ui/KeyboardDismissView';
import { useAppState } from '@/src/state';
import Slider from '@react-native-community/slider';
import React from 'react';
import { Divider, List, Switch } from 'react-native-paper';

export default function SettingsScreen() {
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

  return (
    <KeyboardDismissView style={{ flex: 1 }}>
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
    </KeyboardDismissView>
  );
}
