import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';
import { Bell, Volume2, Vibrate, MessageSquare } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [quickMessages, setQuickMessages] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={24} color="#FF3B30" />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#3A3A3C', true: '#FF3B30' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Volume2 size={24} color="#FF3B30" />
            <Text style={styles.settingLabel}>Sound</Text>
          </View>
          <Switch
            value={sound}
            onValueChange={setSound}
            trackColor={{ false: '#3A3A3C', true: '#FF3B30' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Vibrate size={24} color="#FF3B30" />
            <Text style={styles.settingLabel}>Vibration</Text>
          </View>
          <Switch
            value={vibration}
            onValueChange={setVibration}
            trackColor={{ false: '#3A3A3C', true: '#FF3B30' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MessageSquare size={24} color="#FF3B30" />
            <Text style={styles.settingLabel}>Quick Messages</Text>
          </View>
          <Switch
            value={quickMessages}
            onValueChange={setQuickMessages}
            trackColor={{ false: '#3A3A3C', true: '#FF3B30' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Pressable style={styles.aboutItem}>
          <Text style={styles.aboutText}>Privacy Policy</Text>
        </Pressable>
        <Pressable style={styles.aboutItem}>
          <Text style={styles.aboutText}>Terms of Service</Text>
        </Pressable>
        <Pressable style={styles.aboutItem}>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    marginLeft: 12,
  },
  aboutItem: {
    paddingVertical: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontFamily: 'Inter_400Regular',
  },
});