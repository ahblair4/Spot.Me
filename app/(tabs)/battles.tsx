import { View, Text, StyleSheet, Modal, TextInput, ScrollView } from 'react-native';
import { Star, Plus, CreditCard as Edit2, Trophy, Star as StarFilled, X, ChevronDown, GripVertical } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type BattleStatus = 'Completed' | 'Active' | 'Upcoming';
type BattleRound = 'Top 64' | 'Top 32' | 'Top 16' | 'Great 8' | 'Semifinal' | 'Final';

const ROUNDS: BattleRound[] = ['Top 64', 'Top 32', 'Top 16', 'Great 8', 'Semifinal', 'Final'];

const ROUND_ORDER: Record<BattleRound, number> = {
  'Top 64': 1,
  'Top 32': 2,
  'Top 16': 3,
  'Great 8': 4,
  'Semifinal': 5,
  'Final': 6,
};

type Battle = {
  id: string;
  driver: string;
  spotter: string;
  round: BattleRound;
  winner?: 'driver' | 'spotter';
  isFavorite?: boolean;
  order?: number;
};

const UPCOMING_BATTLES: Battle[] = [
  {
    id: '1',
    driver: 'Alex Smith',
    spotter: 'Mike Johnson',
    round: 'Top 32',
    isFavorite: false,
    order: 0,
  },
  {
    id: '2',
    driver: 'Sarah Wilson',
    spotter: 'Tom Davis',
    round: 'Top 16',
    isFavorite: true,
    order: 1,
  },
];

type NewBattle = {
  leadFirst: string;
  chaseFirst: string;
  round: BattleRound | null;
};

export default function BattlesScreen() {
  const [battles, setBattles] = useState<Battle[]>(UPCOMING_BATTLES);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoundPicker, setShowRoundPicker] = useState(false);
  const [newBattle, setNewBattle] = useState<NewBattle>({
    leadFirst: '',
    chaseFirst: '',
    round: null,
  });

  const getBattleStatus = (battle: Battle): BattleStatus => {
    if (battle.winner) {
      return 'Completed';
    }
    
    const earliestUncompletedBattle = battles
      .filter(b => !b.winner)
      .sort((a, b) => ROUND_ORDER[a.round] - ROUND_ORDER[b.round])[0];

    if (earliestUncompletedBattle?.id === battle.id) {
      return 'Active';
    }

    return 'Upcoming';
  };

  const sortedBattles = useMemo(() => {
    if (isEditing) {
      return battles;
    }
    return [...battles].sort((a, b) => ROUND_ORDER[a.round] - ROUND_ORDER[b.round]);
  }, [battles, isEditing]);

  const toggleFavorite = (battleId: string) => {
    setBattles(prev => prev.map(battle => 
      battle.id === battleId 
        ? { ...battle, isFavorite: !battle.isFavorite }
        : battle
    ));
  };

  const setWinner = (battleId: string, winner: 'driver' | 'spotter') => {
    setBattles(prev => prev.map(battle =>
      battle.id === battleId
        ? { ...battle, winner }
        : battle
    ));
  };

  const deleteBattle = (battleId: string) => {
    setBattles(prev => prev.filter(battle => battle.id !== battleId));
  };

  const addBattle = () => {
    if (!newBattle.round || !newBattle.leadFirst || !newBattle.chaseFirst) {
      return;
    }

    const battle: Battle = {
      id: Date.now().toString(),
      driver: newBattle.leadFirst,
      spotter: newBattle.chaseFirst,
      round: newBattle.round,
      isFavorite: false,
      order: battles.length,
    };

    setBattles(prev => [...prev, battle]);
    setNewBattle({ leadFirst: '', chaseFirst: '', round: null });
    setShowAddModal(false);
  };

  const getStatusStyle = (status: BattleStatus) => {
    switch (status) {
      case 'Completed':
        return styles.statusCompleted;
      case 'Active':
        return styles.statusActive;
      case 'Upcoming':
        return styles.statusUpcoming;
    }
  };

  const renderBattle = ({ item, drag, isActive }: any) => {
    const status = getBattleStatus(item);
    
    return (
      <ScaleDecorator>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Pressable 
            style={[
              styles.battleCard,
              isEditing && styles.battleCardEditing,
              isActive && styles.battleCardDragging
            ]}
            onLongPress={isEditing ? drag : undefined}
          >
            {isEditing && (
              <>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => deleteBattle(item.id)}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
                <View style={styles.dragHandle}>
                  <GripVertical size={20} color="#8E8E93" />
                </View>
              </>
            )}
            
            <View style={styles.battleHeader}>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
              >
                {item.isFavorite ? (
                  <StarFilled size={20} color="#FF3B30" fill="#FF3B30" />
                ) : (
                  <Star size={20} color="#FF3B30" />
                )}
              </Pressable>
              <Text style={styles.roundText}>{item.round}</Text>
            </View>

            <View style={styles.battleInfo}>
              <View style={styles.participantRow}>
                <View style={styles.participantInfo}>
                  <Text style={styles.label}>Lead First:</Text>
                  <Text style={styles.value}>{item.driver}</Text>
                </View>
                {!item.winner && status === 'Active' && (
                  <Pressable
                    style={styles.winnerButton}
                    onPress={() => setWinner(item.id, 'driver')}
                  >
                    <Trophy size={16} color="#8E8E93" />
                  </Pressable>
                )}
                {item.winner === 'driver' && (
                  <Trophy size={16} color="#FFD700" />
                )}
              </View>

              <View style={styles.participantRow}>
                <View style={styles.participantInfo}>
                  <Text style={styles.label}>Chase First:</Text>
                  <Text style={styles.value}>{item.spotter}</Text>
                </View>
                {!item.winner && status === 'Active' && (
                  <Pressable
                    style={styles.winnerButton}
                    onPress={() => setWinner(item.id, 'spotter')}
                  >
                    <Trophy size={16} color="#8E8E93" />
                  </Pressable>
                )}
                {item.winner === 'spotter' && (
                  <Trophy size={16} color="#FFD700" />
                )}
              </View>

              <View style={styles.statusContainer}>
                <Text style={[styles.status, getStatusStyle(status)]}>
                  {status}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Upcoming Battles</Text>
      <DraggableFlatList
        data={sortedBattles}
        onDragEnd={({ data }) => setBattles(data)}
        keyExtractor={item => item.id}
        renderItem={renderBattle}
        contentContainerStyle={styles.battlesList}
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
              <Text style={styles.modalTitle}>New Battle</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewBattle({ leadFirst: '', chaseFirst: '', round: null });
                }}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Lead First</Text>
              <TextInput
                style={styles.input}
                value={newBattle.leadFirst}
                onChangeText={(text) => setNewBattle(prev => ({ ...prev, leadFirst: text }))}
                placeholder="Enter lead driver's name"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Chase First</Text>
              <TextInput
                style={styles.input}
                value={newBattle.chaseFirst}
                onChangeText={(text) => setNewBattle(prev => ({ ...prev, chaseFirst: text }))}
                placeholder="Enter chase driver's name"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Round</Text>
              <Pressable
                style={styles.roundSelector}
                onPress={() => setShowRoundPicker(true)}
              >
                <Text style={[
                  styles.roundSelectorText,
                  !newBattle.round && styles.roundSelectorPlaceholder
                ]}>
                  {newBattle.round || 'Select round'}
                </Text>
                <ChevronDown size={20} color="#8E8E93" />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.addBattleButton,
                (!newBattle.leadFirst || !newBattle.chaseFirst || !newBattle.round) && 
                styles.addBattleButtonDisabled
              ]}
              onPress={addBattle}
              disabled={!newBattle.leadFirst || !newBattle.chaseFirst || !newBattle.round}
            >
              <Text style={styles.addBattleButtonText}>Add Battle</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRoundPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Round</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowRoundPicker(false)}
              >
                <X size={24} color="#8E8E93" />
              </Pressable>
            </View>

            <ScrollView style={styles.roundList}>
              {ROUNDS.map((round) => (
                <Pressable
                  key={round}
                  style={styles.roundOption}
                  onPress={() => {
                    setNewBattle(prev => ({ ...prev, round }));
                    setShowRoundPicker(false);
                  }}
                >
                  <Text style={[
                    styles.roundOptionText,
                    newBattle.round === round && styles.roundOptionTextSelected
                  ]}>
                    {round}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  battlesList: {
    gap: 16,
    paddingBottom: 80,
  },
  battleCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  battleCardEditing: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  battleCardDragging: {
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
  battleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roundText: {
    color: '#FF3B30',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  battleInfo: {
    gap: 8,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#8E8E93',
    width: 85,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  statusContainer: {
    marginTop: 8,
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: '#30D158',
    color: '#000000',
  },
  statusUpcoming: {
    backgroundColor: '#FF9500',
    color: '#000000',
  },
  statusCompleted: {
    backgroundColor: '#8E8E93',
    color: '#FFFFFF',
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
  favoriteButton: {
    padding: 4,
  },
  winnerButton: {
    padding: 8,
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
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#8E8E93',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  roundSelector: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundSelectorText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  roundSelectorPlaceholder: {
    color: '#8E8E93',
  },
  roundList: {
    maxHeight: 300,
  },
  roundOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  roundOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  roundOptionTextSelected: {
    color: '#FF3B30',
    fontFamily: 'Inter_600SemiBold',
  },
  addBattleButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addBattleButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  addBattleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});