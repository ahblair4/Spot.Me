import { View, Text, StyleSheet, Pressable, TextInput, Modal, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Crown, Star, Clock, Trophy, Plus, X, ArrowLeft, GripVertical, Search } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTeamStore } from '../../../stores/teamStore';
import { useContactStore } from '../../../stores/contactStore';

type TeamMember = {
  id: string;
  name: string;
  role: 'driver' | 'spotter' | 'crew';
  joinedAt: string;
  avatar: string;
  order?: number;
};

const ROLES = ['driver', 'spotter', 'crew'] as const;

export default function TeamDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const teamId = typeof id === 'string' ? id : id[0];
  const { getTeam } = useTeamStore();
  const { contacts } = useContactStore();
  const team = getTeam(teamId);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.role.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  if (!team) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace('/profile')}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.errorText}>Team not found</Text>
        </View>
      </View>
    );
  }

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

  const removeMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const addMember = (contact: typeof contacts[0]) => {
    const existingMember = members.find(member => member.id === contact.id);
    if (existingMember) return;

    const member: TeamMember = {
      id: contact.id,
      name: contact.name,
      role: contact.role,
      joinedAt: new Date().toISOString(),
      avatar: contact.avatar,
      order: members.length,
    };

    setMembers(prev => [...prev, member]);
    setShowAddModal(false);
    setSearchQuery('');
  };

  const renderMember = ({ item, drag, isActive }: any) => {
    return (
      <ScaleDecorator>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Pressable 
            style={[
              styles.memberCard,
              isEditing && styles.memberCardEditing,
              isActive && styles.memberCardDragging,
              item.role === 'driver' && styles.memberCardFirst,
            ]}
            onLongPress={isEditing ? drag : undefined}
          >
            {isEditing && (
              <>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => removeMember(item.id)}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
                <View style={styles.dragHandle}>
                  <GripVertical size={20} color="#8E8E93" />
                </View>
              </>
            )}
            
            <View style={styles.memberInfo}>
              <View style={styles.roleContainer}>
                {getRoleIcon(item.role)}
                <Text style={styles.roleName}>
                  {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                </Text>
              </View>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.joinDate}>
                Joined {new Date(item.joinedAt).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </ScaleDecorator>
    );
  };

  const renderContact = ({ item }: { item: typeof contacts[0] }) => (
    <Pressable
      style={styles.contactOption}
      onPress={() => addMember(item)}
    >
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <View style={styles.roleContainer}>
          {getRoleIcon(item.role)}
          <Text style={styles.roleName}>
            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace('/profile')}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>{team.name}</Text>
        {team.type === 'pro' && (
          <View style={styles.proBadge}>
            <Trophy size={12} color="#FFD700" />
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        )}
      </View>

      <DraggableFlatList
        data={members}
        onDragEnd={({ data }) => setMembers(data)}
        keyExtractor={item => item.id}
        renderItem={renderMember}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Team Members</Text>
        }
        enabled={isEditing}
      />

      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.editButton, isEditing && styles.editButtonActive]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Plus size={24} color={isEditing ? '#FF3B30' : '#FFFFFF'} />
        </Pressable>
        <Pressable 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Team Member</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                }}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search contacts..."
                placeholderTextColor="#8E8E93"
              />
            </View>

            <FlatList
              data={filteredContacts}
              renderItem={renderContact}
              keyExtractor={item => item.id}
              style={styles.contactsList}
              contentContainerStyle={styles.contactsListContent}
            />
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  errorText: {
    flex: 1,
    fontSize: 16,
    color: '#FF3B30',
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
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
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  memberCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  memberCardEditing: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  memberCardDragging: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  memberCardFirst: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  memberInfo: {
    gap: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleName: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  joinDate: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonActive: {
    backgroundColor: '#FFFFFF',
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
  dragHandle: {
    position: 'absolute',
    top: '50%',
    right: -30,
    transform: [{ translateY: -10 }],
    padding: 8,
    zIndex: 1,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  contactsList: {
    maxHeight: '70%',
  },
  contactsListContent: {
    gap: 8,
  },
  contactOption: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 16,
  },
  contactInfo: {
    gap: 4,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});