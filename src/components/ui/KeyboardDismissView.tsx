import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, ViewProps } from 'react-native';

interface KeyboardDismissViewProps extends ViewProps {
  children: React.ReactNode;
}

export function KeyboardDismissView({ children, ...props }: KeyboardDismissViewProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View {...props} style={[{ flex: 1 }, props.style]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
}
