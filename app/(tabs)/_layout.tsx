import React from 'react';
import { Tabs } from 'expo-router';
import { Flag, MessageCircle, Settings, User } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTeamStore } from '../../stores/teamStore';
import { TeamSelector } from '../../components/TeamSelector';

export default function TabLayout() {
  const activeTeam = useTeamStore(state => state.activeTeam);
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FF3B30',
        tabBarInactiveTintColor: '#8E8E93',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: '#FFFFFF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          headerTitle: () => (
            <View style={styles.headerContent}>
              <TeamSelector />
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
          tabBarLabel: 'Messages',
        }}
      />
      <Tabs.Screen
        name="battles"
        options={{
          title: 'Battles',
          tabBarIcon: ({ color, size }) => (
            <Flag size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1C1C1E',
    borderTopColor: '#2C2C2E',
    height: 60,
    paddingBottom: 8,
  },
  header: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});