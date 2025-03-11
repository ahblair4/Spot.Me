import { View, Text, StyleSheet, Image, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { Users, QrCode, UserPlus, X, ScanLine, Trophy, Users as Users2, Plus, Settings2, LogOut, Crown, Star, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useTeamStore } from '../../stores/teamStore';
import { Contact, useContactStore } from '../../stores/contactStore';

type NewContact = {
  name: string;
  role: 'driver' | 'spotter' | 'crew';
};

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

const ROLES = ['driver', 'spotter', 'crew'] as const;

const AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
];

export default function ProfileScreen() {
  const router = useRouter();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrMode, setQrMode] = useState<'display' | 'scan'>('display');
  const [isManagingTeams, setIsManagingTeams] = useState(false);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState<NewContact>({
    name: '',
    role: 'crew',
  });
  const { teams, addTeam } = useTeamStore();
  const { contacts, addContact, removeContact } = useContactStore();
  const [newTeam, setNewTeam] = useState({
    name: '',
    type: 'amateur' as 'amateur' | 'pro',
    role: 'spotter' as 'driver' | 'spotter' | 'crew',
  });
  const userId = 'user123'; // This would come from your auth system

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'qr':
        setQrModalVisible(true);
        break;
      case 'contacts':
        setShowContactsModal(true);
        break;
    }
  };

  const handleViewTeam = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) return;

    addTeam({
      name: newTeam.name.trim(),
      type: newTeam.type,
      role: newTeam.role,
    }, userId);

    setNewTeam({ name: '', type: 'amateur', role: 'spotter' });
    setShowNewTeamModal(false);
    setIsManagingTeams(false);
  };

  const handleLeaveTeam = (teamId: string) => {
    // TODO: Implement leave team functionality
  };

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;

    addContact({
      name: newContact.name.trim(),
      role: newContact.role,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    });

    setNewContact({ name: '', role: 'crew' });
    setShowAddContactModal(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'driver':
        return <Crown size={16} color="#FFD700" />;
      case 'spotter':
        return <Star size={16} color="#FF3B30" />;
      default:
        return <Clock size={16} color="#8E8E93" />;
    }
  };

  const renderContact = (contact: Contact) => (
    <View key={contact.id} style={styles.contactCard}>
      <Pressable
        style={styles.deleteButton}
        onPress={() => removeContact(contact.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </Pressable>

      <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <View style={styles.roleContainer}>
          {getRoleIcon(contact.role)}
          <Text style={styles.roleName}>
            {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
          </Text>
        </View>
        <Text style={styles.joinDate}>
          Added {contact.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

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
          <View key={index} style={styles.actionItem}>
            <Pressable onPress={() => handleActionPress(action.action)}>
              <action.icon size={28} color="#FF3B30" />
              <Text style={styles.actionText}>{action.label}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Teams</Text>
          <View style={styles.manageButton}>
            <Pressable onPress={() => setIsManagingTeams(!isManagingTeams)}>
              <View style={styles.manageButtonContent}>
                <Settings2 size={20} color={isManagingTeams ? '#FF3B30' : '#FFFFFF'} />
                <Text style={[styles.manageButtonText, isManagingTeams && styles.manageButtonTextActive]}>
                  Manage Teams
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {isManagingTeams && (
          <View style={styles.newTeamButton}>
            <Pressable onPress={() => setShowNewTeamModal(true)}>
              <View style={styles.newTeamButtonContent}>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.newTeamButtonText}>Create New Team</Text>
              </View>
            </Pressable>
          </View>
        )}

        {teams.map((team) => (
          <View key={team.id} style={styles.teamItem}>
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
                  <View style={styles.leaveButton}>
                    <Pressable onPress={() => handleLeaveTeam(team.id)}>
                      <View style={styles.leaveButtonContent}>
                        <LogOut size={16} color="#FF3B30" />
                        <Text style={styles.leaveButtonText}>Leave</Text>
                      </View>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.viewButton}>
                    <Pressable onPress={() => handleViewTeam(team.id)}>
                      <Text style={styles.viewButtonText}>View</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </View>
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
              <View style={styles.closeButton}>
                <Pressable onPress={() => setQrModalVisible(false)}>
                  <X size={24} color="#8E8E93" />
                </Pressable>
              </View>
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

            <View style={styles.switchModeButton}>
              <Pressable onPress={() => setQrMode(qrMode === 'display' ? 'scan' : 'display')}>
                <Text style={styles.switchModeText}>
                  {qrMode === 'display' ? 'Scan QR Code' : 'Show My QR Code'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showNewTeamModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowNewTeamModal(false);
          setNewTeam({ name: '', type: 'amateur', role: 'spotter' });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Team</Text>
              <View style={styles.closeButton}>
                <Pressable
                  onPress={() => {
                    setShowNewTeamModal(false);
                    setNewTeam({ name: '', type: 'amateur', role: 'spotter' });
                  }}
                >
                  <X size={24} color="#8E8E93" />
                </Pressable>
              </View>
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
                <View style={[styles.teamTypeButton, newTeam.type === 'amateur' && styles.teamTypeButtonActive]}>
                  <Pressable onPress={() => setNewTeam(prev => ({ ...prev, type: 'amateur' }))}>
                    <Text style={[styles.teamTypeButtonText, newTeam.type === 'amateur' && styles.teamTypeButtonTextActive]}>
                      Amateur
                    </Text>
                  </Pressable>
                </View>
                <View style={[styles.teamTypeButton, newTeam.type === 'pro' && styles.teamTypeButtonActive]}>
                  <Pressable onPress={() => setNewTeam(prev => ({ ...prev, type: 'pro' }))}>
                    <View style={styles.teamTypeButtonContent}>
                      <Trophy size={16} color={newTeam.type === 'pro' ? '#FFFFFF' : '#FFD700'} />
                      <Text style={[styles.teamTypeButtonText, newTeam.type === 'pro' && styles.teamTypeButtonTextActive]}>
                        Pro
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Role</Text>
              <View style={styles.roleButtons}>
                {ROLES.map((role) => (
                  <Pressable
                    key={role}
                    style={[
                      styles.roleButton,
                      newTeam.role === role && styles.roleButtonActive
                    ]}
                    onPress={() => setNewTeam(prev => ({ ...prev, role }))}
                  >
                    {getRoleIcon(role)}
                    <Text style={[
                      styles.roleButtonText,
                      newTeam.role === role && styles.roleButtonTextActive
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </Pressable>
                ))}
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

      <Modal
        visible={showContactsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contacts</Text>
              <View style={styles.closeButton}>
                <Pressable onPress={() => setShowContactsModal(false)}>
                  <X size={24} color="#8E8E93" />
                </Pressable>
              </View>
            </View>

            <ScrollView style={styles.contactsList}>
              {contacts.map(renderContact)}
            </ScrollView>

            <Pressable
              style={styles.addContactButton}
              onPress={() => {
                setShowContactsModal(false);
                setShowAddContactModal(true);
              }}
            >
              <Plus size={24} color="#FFFFFF" />
              <Text style={styles.addContactButtonText}>Add Contact</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddContactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddContactModal(false);
          setNewContact({ name: '', role: 'crew' });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Contact</Text>
              <View style={styles.closeButton}>
                <Pressable
                  onPress={() => {
                    setShowAddContactModal(false);
                    setNewContact({ name: '', role: 'crew' });
                  }}
                >
                  <X size={24} color="#8E8E93" />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={newContact.name}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
                placeholder="Enter contact's name"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleButtons}>
                {ROLES.map((role) => (
                  <Pressable
                    key={role}
                    style={[
                      styles.roleButton,
                      newContact.role === role && styles.roleButtonActive
                    ]}
                    onPress={() => setNewContact(prev => ({ ...prev, role }))}
                  >
                    {getRoleIcon(role)}
                    <Text style={[
                      styles.roleButtonText,
                      newContact.role === role && styles.roleButtonTextActive
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              style={[
                styles.addContactButton,
                !newContact.name.trim() && styles.addContactButtonDisabled
              ]}
              onPress={handleAddContact}
              disabled={!newContact.name.trim()}
            >
              <Text style={styles.addContactButtonText}>Add Contact</Text>
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
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  manageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
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
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    marginBottom: 16,
  },
  newTeamButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
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
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  leaveButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  leaveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    maxHeight: '80%',
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
    borderRadius: 12,
  },
  switchModeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    padding: 16,
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
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  teamTypeButtonActive: {
    backgroundColor: '#FF3B30',
  },
  teamTypeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  teamTypeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    padding: 12,
  },
  teamTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  createTeamButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    marginTop: 8,
  },
  createTeamButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  createTeamButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    padding: 16,
  },
  contactsList: {
    maxHeight: '60%',
  },
  contactCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleName: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  joinDate: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 8,
  },
  roleButtonActive: {
    backgroundColor: '#FF3B30',
  },
  roleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  addContactButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  addContactButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  addContactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});