import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { useTeamStore } from '../stores/teamStore';

type Team = {
  id: string;
  name: string;
};

const TEAMS: Team[] = [
  { id: '1', name: 'Drift Kings' },
  { id: '2', name: 'Night Runners' },
  { id: '3', name: 'Apex Hunters' },
];

export function TeamSelector() {
  const [showModal, setShowModal] = useState(false);
  const { activeTeam, setActiveTeam } = useTeamStore();

  const handleTeamSelect = (team: Team) => {
    setActiveTeam(team);
    setShowModal(false);
  };

  return (
    <>
      <Pressable 
        style={styles.selector}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.selectorText}>
          {activeTeam?.name || 'Select Team'}
        </Text>
        <ChevronDown size={20} color="#8E8E93" />
      </Pressable>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Team</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
            </View>

            <ScrollView style={styles.teamList}>
              {TEAMS.map((team) => (
                <Pressable
                  key={team.id}
                  style={[
                    styles.teamOption,
                    activeTeam?.id === team.id && styles.teamOptionActive
                  ]}
                  onPress={() => handleTeamSelect(team)}
                >
                  <Text style={[
                    styles.teamOptionText,
                    activeTeam?.id === team.id && styles.teamOptionTextActive
                  ]}>
                    {team.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  selectorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  teamList: {
    maxHeight: 300,
  },
  teamOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#2C2C2E',
  },
  teamOptionActive: {
    backgroundColor: '#FF3B30',
  },
  teamOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  teamOptionTextActive: {
    color: '#FFFFFF',
  },
});