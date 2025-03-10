import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Trophy, Crown, Star, Clock, CreditCard as Edit2, X, Plus, GripVertical, LogOut } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type TeamMember = {
  id: string;
  name: string;
  role: 'driver' | 'spotter' | 'crew';
  joinedAt: string;
  avatar: string;
  order?: number;
};

type NewMember = {
  name: string;
  role: 'driver' | 'spotter' | 'crew';
};

// Mock data - replace with actual data fetching
const TEAM_MEMBERS: Record<string, TeamMember[]> = {
  '1': [
    {
      id: '1',
      name: 'Mike Chen',
      role: 'driver',
      joinedAt: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      order: 0,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'spotter',
      joinedAt: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      order: 1,
    },
    {
      id: '3',
      name: 'Alex Rodriguez',
      role: 'crew',
      joinedAt: '2024-01-20',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      order: 2,
    },
    {
      id: '4',
      name: 'Emily White',
      role: 'crew',
      joinedAt: '2024-02-01',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      order: 3,
    },
  ],
};

const TEAMS: Record<string, { name: string; type: 'pro' | 'amateur' }> = {
  '1': { name: 'Drift Kings', type: 'pro' },
};

const ROLES = ['driver', 'spotter', 'crew'] as const;

export default function TeamDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const teamId = typeof id === 'string' ? id : id[0];
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [members, setMembers] = useState(TEAM_MEMBERS[teamId] || []);
  const [newMember, setNewMember] = useState<NewMember>({
    name: '',
    role: 'crew',
  });

  const team = TEAMS[teamId];

  const sortedMembers = useMemo(() => {
    if (isEditing) {
      return members;
    }
    return [...members].sort((a, b) => {
      const roleOrder = { driver: 0, spotter: 1, crew: 2 };
      const roleDiff = roleOrder[a.role] - roleOrder[b.role];
      
      if (roleDiff !== 0) return roleDiff;
      return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
    });
  }, [members, isEditing]);

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Team not found</Text>
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

  const addMember = () => {
    if (!newMember.name.trim()) return;

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name.trim(),
      role: newMember.role,
      joinedAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      order: members.length,
    };

    setMembers(prev => [...prev, member]);
    setNewMember({ name: '', role: 'crew' });
    setShowAddModal(false);
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
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
        data={sortedMembers}
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
          <Edit2 size={24} color={isEditing ? '#FF3B30' : '#FFFFFF'} />
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
                  setNewMember({ name: '', role: 'crew' });
                }}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={newMember.name}
                onChangeText={(text) => setNewMember(prev => ({ ...prev, name: text }))}
                placeholder="Enter member's name"
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
                      newMember.role === role && styles.roleButtonActive
                    ]}
                    onPress={() => setNewMember(prev => ({ ...prev, role }))}
                  >
                    {getRoleIcon(role)}
                    <Text style={[
                      styles.roleButtonText,
                      newMember.role === role && styles.roleButtonTextActive
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              style={[
                styles.addMemberButton,
                !newMember.name.trim() && styles.addMemberButtonDisabled
              ]}
              onPress={addMember}
              disabled={!newMember.name.trim()}
            >
              <Text style={styles.addMemberButtonText}>Add Member</Text>
            </Pressable>
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
    gap: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
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
  addMemberButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addMemberButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  addMemberButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginTop: 24,
  },
});