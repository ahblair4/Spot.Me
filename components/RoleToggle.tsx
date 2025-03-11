import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRoleStore } from '../stores/roleStore';

export function RoleToggle() {
  const { role, toggleRole } = useRoleStore();

  return (
    <Pressable 
      style={styles.button} 
      onPress={toggleRole}
    >
      <Text style={styles.text}>
        {role === 'spotter' ? 'Spotter Mode' : 'Driver Mode'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});