import { View, Text, StyleSheet, FlatList, Image, Pressable, Modal, TextInput } from 'react-native';
import { Crown, Star, Clock, Plus, X, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { Contact, useContactStore } from '../../stores/contactStore';

type NewContact = {
  name: string;
  role: 'driver' | 'spotter' | 'crew';
};

const ROLES = ['driver', 'spotter', 'crew'] as const;

const AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
];

export default function ContactsScreen() {
  const { contacts, addContact, removeContact } = useContactStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState<NewContact>({
    name: '',
    role: 'crew',
  });

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

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;

    addContact({
      name: newContact.name.trim(),
      role: newContact.role,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    });

    setNewContact({ name: '', role: 'crew' });
    setShowAddModal(false);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactCard}>
      <Pressable
        style={styles.deleteButton}
        onPress={() => removeContact(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </Pressable>

      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <View style={styles.roleContainer}>
          {getRoleIcon(item.role)}
          <Text style={styles.roleName}>
            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
          </Text>
        </View>
        <Text style={styles.joinDate}>
          Added {item.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <View style={styles.addButton}>
          <Pressable onPress={() => setShowAddModal(true)}>
            <Plus size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactsList}
      />

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setNewContact({ name: '', role: 'crew' });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Contact</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewContact({ name: '', role: 'crew' });
                }}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsList: {
    padding: 16,
    gap: 16,
  },
  contactCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactName: {
    fontSize: 18,
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
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    height: 48,
  },
  addContactButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  addContactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 24,
  },
});