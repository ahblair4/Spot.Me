import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { Send, X, Keyboard, ArrowLeft } from 'lucide-react-native';
import { useRoleStore } from '../../stores/roleStore';
import { RoleToggle } from '../../components/RoleToggle';
import { useNavigation } from 'expo-router';

type Message = {
  id: string;
  text: string;
  sender: 'spotter' | 'driver';
  timestamp: Date;
};

type Selection = {
  line?: number;
  angle?: number;
  proximity?: number;
  giveMeA?: number;
};

type ZeroRunOption = 'mechanical' | 'spin' | 'crash' | null;

type DriverQuickMessage = {
  id: string;
  text: string;
};

const DRIVER_QUICK_MESSAGES: DriverQuickMessage[] = [
  { id: '1', text: 'Ready' },
  { id: '2', text: 'Need a minute' },
  { id: '3', text: 'Understood' },
  { id: '4', text: 'Elaborate' },
  { id: '5', text: 'Water temp high' },
  { id: '6', text: 'Low oil pressure' },
  { id: '7', text: 'Need tires' },
  { id: '8', text: 'Coming back to pit' },
];

export default function MessagesScreen() {
  const navigation = useNavigation();
  const role = useRoleStore(state => state.role);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selection, setSelection] = useState<Selection>({});
  const [showZeroRunOptions, setShowZeroRunOptions] = useState(false);
  const [zeroRunSelection, setZeroRunSelection] = useState<ZeroRunOption>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  // Set up the header right button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <RoleToggle />,
    });
  }, [navigation]);

  const sendMessage = useCallback((text?: string) => {
    let messageText: string;

    if (text) {
      messageText = text;
    } else if (role === 'driver') {
      return; // Driver must select a quick message
    } else if (showZeroRunOptions && zeroRunSelection) {
      const zeroRunMessages = {
        mechanical: 'Chase car mechanical failure',
        spin: 'Chase car spin',
        crash: 'Chase car crashed'
      };
      messageText = zeroRunMessages[zeroRunSelection];
    } else if (showCustomInput && customMessage.trim()) {
      messageText = customMessage.trim();
    } else if (!selection.line || !selection.angle || !selection.proximity || !selection.giveMeA) {
      return; // Don't send if not all values are selected
    } else {
      messageText = [
        `Angle: ${selection.angle}`,
        `Line: ${selection.line}`,
        `Proximity: ${selection.proximity}`,
        `Give me a: ${selection.giveMeA}`,
      ].join('\n');
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: role,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setSelection({});
    setZeroRunSelection(null);
    setShowZeroRunOptions(false);
    setCustomMessage('');
    setShowCustomInput(false);
  }, [selection, showZeroRunOptions, zeroRunSelection, role, customMessage, showCustomInput]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === role ? styles.outgoingMessage : styles.incomingMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const renderDriverInterface = () => (
    <View style={styles.driverContainer}>
      <FlatList
        data={DRIVER_QUICK_MESSAGES}
        renderItem={({ item }) => (
          <Pressable
            style={styles.driverButton}
            onPress={() => sendMessage(item.text)}
          >
            <Text style={styles.driverButtonText}>{item.text}</Text>
          </Pressable>
        )}
        numColumns={2}
        columnWrapperStyle={styles.driverButtonRow}
        contentContainerStyle={styles.driverButtonsContainer}
      />
    </View>
  );

  const renderCustomInput = () => (
    <View style={styles.customInputContainer}>
      <View style={styles.customInputHeader}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            setShowCustomInput(false);
            setCustomMessage('');
          }}>
          <ArrowLeft color="#FF3B30" size={24} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.customInputTitle}>Custom Message</Text>
      </View>
      <View style={styles.textInputWrapper}>
        <TextInput
          style={styles.customTextInput}
          value={customMessage}
          onChangeText={setCustomMessage}
          placeholder="Type your message..."
          placeholderTextColor="#8E8E93"
          multiline
          maxLength={500}
          autoFocus
        />
      </View>
      <Pressable
        style={[styles.sendButton, !customMessage.trim() && styles.sendButtonDisabled]}
        onPress={() => sendMessage()}
        disabled={!customMessage.trim()}>
        <Send color={customMessage.trim() ? '#FFFFFF' : '#8E8E93'} size={24} />
      </Pressable>
    </View>
  );

  const renderSpotterInterface = () => {
    if (showCustomInput) {
      return renderCustomInput();
    }

    return (
      <>
        {!showZeroRunOptions ? (
          <>
            <View style={styles.quickButtonsSection}>
              <View style={styles.quickButtonsRow}>
                <Text style={styles.quickButtonsLabel}>Line:</Text>
                {[1, 2, 3, 4, 5].map(value => renderQuickButton('line', value))}
              </View>
              <View style={styles.quickButtonsRow}>
                <Text style={styles.quickButtonsLabel}>Angle:</Text>
                {[1, 2, 3, 4, 5].map(value => renderQuickButton('angle', value))}
              </View>
              <View style={styles.quickButtonsRow}>
                <Text style={styles.quickButtonsLabel}>Proximity:</Text>
                {[1, 2, 3, 4, 5].map(value => renderQuickButton('proximity', value))}
              </View>
              <View style={styles.quickButtonsRow}>
                <Text style={styles.quickButtonsLabel}>Give me a:</Text>
                {[1, 2, 3, 4, 5].map(value => renderQuickButton('giveMeA', value))}
              </View>
            </View>
            <View style={styles.bottomButtons}>
              <Pressable
                style={styles.customMessageButton}
                onPress={() => setShowCustomInput(true)}>
                <Keyboard size={20} color="#FF3B30" />
                <Text style={styles.customMessageButtonText}>Custom Message</Text>
              </Pressable>
              <Pressable
                style={styles.zeroRunToggle}
                onPress={() => setShowZeroRunOptions(true)}>
                <Text style={styles.zeroRunToggleText}>Zero Run Options</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.zeroRunSection}>
            <View style={styles.zeroRunHeader}>
              <Text style={styles.zeroRunTitle}>Zero Run Options</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowZeroRunOptions(false);
                  setZeroRunSelection(null);
                }}>
                <X color="#8E8E93" size={24} />
              </Pressable>
            </View>
            <View style={styles.zeroRunOptions}>
              {renderZeroRunOption('mechanical', 'Chase car mechanical failure')}
              {renderZeroRunOption('spin', 'Chase car spin')}
              {renderZeroRunOption('crash', 'Chase car crashed')}
            </View>
          </View>
        )}
        
        <Pressable 
          style={[styles.sendButton, !allSelected && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!allSelected}>
          <Send color={allSelected ? '#FFFFFF' : '#8E8E93'} size={24} />
        </Pressable>
      </>
    );
  };

  const renderQuickButton = (type: keyof Selection, value: number) => {
    const isSelected = selection[type] === value;
    return (
      <Pressable
        key={`${type}-${value}`}
        style={[styles.quickButton, isSelected && styles.selectedButton]}
        onPress={() => setSelection(prev => ({ ...prev, [type]: value }))}>
        <Text style={[styles.quickButtonText, isSelected && styles.selectedButtonText]}>
          {value}
        </Text>
      </Pressable>
    );
  };

  const renderZeroRunOption = (option: ZeroRunOption, label: string) => {
    const isSelected = zeroRunSelection === option;
    return (
      <Pressable
        style={[styles.zeroRunButton, isSelected && styles.selectedButton]}
        onPress={() => setZeroRunSelection(option)}>
        <Text style={[styles.zeroRunButtonText, isSelected && styles.selectedButtonText]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const allSelected = showZeroRunOptions 
    ? Boolean(zeroRunSelection)
    : Boolean(
        selection.line && 
        selection.angle && 
        selection.proximity && 
        selection.giveMeA
      );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />
      
      <View style={styles.inputContainer}>
        {role === 'spotter' ? renderSpotterInterface() : renderDriverInterface()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  messageList: {
    padding: 16,
    gap: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  outgoingMessage: {
    backgroundColor: '#FF3B30',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  incomingMessage: {
    backgroundColor: '#1C1C1E',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  quickButtonsSection: {
    gap: 12,
    marginBottom: 16,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickButtonsLabel: {
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    width: 100,
  },
  quickButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FF3B30',
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  sendButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF3B30',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  customMessageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 8,
  },
  customMessageButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  zeroRunToggle: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  zeroRunToggleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  zeroRunSection: {
    gap: 16,
    marginBottom: 16,
  },
  zeroRunHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zeroRunTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  zeroRunOptions: {
    gap: 12,
  },
  zeroRunButton: {
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  zeroRunButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  driverContainer: {
    flex: 1,
  },
  driverButtonsContainer: {
    gap: 12,
  },
  driverButtonRow: {
    gap: 12,
    justifyContent: 'space-between',
  },
  driverButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  driverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  customInputContainer: {
    gap: 16,
  },
  customInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  customInputTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginRight: 70, // To offset the back button and center the title
  },
  textInputWrapper: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
  },
  customTextInput: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});