import { View, Text, StyleSheet, Image, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { Users, QrCode, UserPlus, X, ScanLine, Trophy, Users as Users2, Plus, Settings2, LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

type Team = {
  id: string;
  name: string;
  role: string;
  memberCount: number;
  type: 'pro' | 'amateur';
};

const TEAMS: Team[] = [
  {
    id: '1',
    name: 'Drift Kings',
    role: 'Spotter',
    memberCount: 8,
    type: 'pro',
  },
  {
    id: '2',
    name: 'Night Runners',
    role: 'Driver',
    memberCount: 12,
    type: 'amateur',
  },
  {
    id: '3',
    name: 'Apex Hunters',
    role: 'Spotter',
    memberCount: 6,
    type: 'pro',
  },
];

const ACTIONS = [
  {
    icon: Users,
    label: 'Contacts',
    action: 'contacts',
  },
  {
    icon: QrCode,
    label: 'Add User',
    action: 'qr',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrMode, setQrMode] = useState<'display' | 'scan'>('display');
  const [isManagingTeams, setIsManagingTeams] = useState(false);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [newTeam, setNewTeam] = useState({
    name: '',
    type: 'amateur' as 'amateur' | 'pro'
  });
  const userId = 'user123'; // This would come from your auth system

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'qr':
        setQrModalVisible(true);
        break;
      // Handle other actions
    }
  };

  const handleViewTeam = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) return;

    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name.trim(),
      role: 'Spotter', // Default role
      memberCount: 1, // Starting with the creator
      type: newTeam.type,
    };

    setTeams(prev => [...prev, team]);
    setNewTeam({ name: '', type: 'amateur' });
    setShowNewTeamModal(false);
  };

  const handleLeaveTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Austin Blair</Text>
        <View style={styles.userTypeContainer}>
          <Trophy size={16} color="#FFD700" />
          <Text style={styles.userType}>Pro User</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {ACTIONS.map((action, index) => (
          <Pressable
            key={index}
            style={styles.actionItem}
            onPress={() => handleActionPress(action.action)}
          >
            <action.icon size={28} color="#FF3B30" />
            <Text style={styles.actionText}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Teams</Text>
          <Pressable
            style={styles.manageButton}
            onPress={() => setIsManagingTeams(!isManagingTeams)}
          >
            <Settings2 size={20} color={isManagingTeams ? '#FF3B30' : '#FFFFFF'} />
            <Text style={[styles.manageButtonText, isManagingTeams && styles.manageButtonTextActive]}>
              Manage Teams
            </Text>
          </Pressable>
        </View>

        {isManagingTeams && (
          <Pressable
            style={styles.newTeamButton}
            onPress={() => setShowNewTeamModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.newTeamButtonText}>Create New Team</Text>
          </Pressable>
        )}

        {teams.map((team) => (
          <Pressable key={team.id} style={styles.teamItem}>
            <View style={styles.teamContent}>
              <View style={styles.teamHeader}>
                <View>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamRole}>{team.role}</Text>
                </View>
                {team.type === 'pro' && (
                  <View style={styles.proBadge}>
                    <Trophy size={12} color="#FFD700" />
                    <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
                )}
              </View>
              <View style={styles.teamFooter}>
                <View style={styles.memberCount}>
                  <Users2 size={16} color="#8E8E93" />
                  <Text style={styles.memberCountText}>{team.memberCount} members</Text>
                </View>
                {isManagingTeams ? (
                  <Pressable 
                    style={styles.leaveButton}
                    onPress={() => handleLeaveTeam(team.id)}
                  >
                    <LogOut size={16} color="#FF3B30" />
                    <Text style={styles.leaveButtonText}>Leave</Text>
                  </Pressable>
                ) : (
                  <Pressable 
                    style={styles.viewButton}
                    onPress={() => handleViewTeam(team.id)}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <Modal
        visible={qrModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {qrMode === 'display' ? 'Your QR Code' : 'Scan QR Code'}
              </Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setQrModalVisible(false)}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
            </View>

            <View style={styles.qrContainer}>
              {qrMode === 'display' ? (
                <QRCode
                  value={userId}
                  size={200}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />
              ) : (
                <View style={styles.scannerPlaceholder}>
                  <ScanLine size={48} color="#FF3B30" />
                  <Text style={styles.scannerText}>
                    Position QR code within frame
                  </Text>
                </View>
              )}
            </View>

            <Pressable
              style={styles.switchModeButton}
              onPress={() => setQrMode(qrMode === 'display' ? 'scan' : 'display')}
            >
              <Text style={styles.switchModeText}>
                {qrMode === 'display' ? 'Scan QR Code' : 'Show My QR Code'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNewTeamModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowNewTeamModal(false);
          setNewTeam({ name: '', type: 'amateur' });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Team</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowNewTeamModal(false);
                  setNewTeam({ name: '', type: 'amateur' });
                }}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Team Name</Text>
              <TextInput
                style={styles.input}
                value={newTeam.name}
                onChangeText={(text) => setNewTeam(prev => ({ ...prev, name: text }))}
                placeholder="Enter team name"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Team Type</Text>
              <View style={styles.teamTypeButtons}>
                <Pressable
                  style={[
                    styles.teamTypeButton,
                    newTeam.type === 'amateur' && styles.teamTypeButtonActive
                  ]}
                  onPress={() => setNewTeam(prev => ({ ...prev, type: 'amateur' }))}
                >
                  <Text style={[
                    styles.teamTypeButtonText,
                    newTeam.type === 'amateur' && styles.teamTypeButtonTextActive
                  ]}>Amateur</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.teamTypeButton,
                    newTeam.type === 'pro' && styles.teamTypeButtonActive
                  ]}
                  onPress={() => setNewTeam(prev => ({ ...prev, type: 'pro' }))}
                >
                  <Trophy size={16} color={newTeam.type === 'pro' ? '#FFFFFF' : '#FFD700'} />
                  <Text style={[
                    styles.teamTypeButtonText,
                    newTeam.type === 'pro' && styles.teamTypeButtonTextActive
                  ]}>Pro</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[
                styles.createTeamButton,
                !newTeam.name.trim() && styles.createTeamButtonDisabled
              ]}
              onPress={handleCreateTeam}
              disabled={!newTeam.name.trim()}
            >
              <Text style={styles.createTeamButtonText}>Create Team</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userType: {
    fontSize: 16,
    color: '#FFD700',
    fontFamily: 'Inter_600SemiBold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 16,
    minHeight: 100,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  manageButtonTextActive: {
    color: '#FF3B30',
  },
  newTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  newTeamButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  teamItem: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  teamContent: {
    padding: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  teamRole: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  proBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  teamFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberCountText: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  viewButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  leaveButtonText: {
    color: '#FF3B30',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  scannerPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerText: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 12,
    textAlign: 'center',
  },
  switchModeButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  teamTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  teamTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 8,
  },
  teamTypeButtonActive: {
    backgroundColor: '#FF3B30',
  },
  teamTypeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  teamTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  createTeamButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createTeamButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  createTeamButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});