import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownItem {
  title: string;
  content: string;
  items?: string[];  // Add optional items array
}

interface AvoidDropdownsProps {
  items: DropdownItem[];
}

const DropdownSection = ({ title, content, items }: DropdownItem) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    Animated.spring(rotateAnim, {
      toValue: isOpen ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={[styles.dropdownHeader, !isOpen && styles.dropdownHeaderClosed]}>
        <Text style={styles.dropdownTitle}>{title}</Text>
        <View style={styles.iconContainer}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="chevron-down" size={24} color="#FFF" />
          </Animated.View>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownContent}>
          <Text style={styles.dropdownText}>{content}</Text>
          {items && (
            <View style={styles.listContainer}>
              {items.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listItemText}>• {item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default function AvoidDropdowns({ items }: AvoidDropdownsProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <DropdownSection key={index} title={item.title} content={item.content} items={item.items} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownContainer: {
    marginBottom: 8,
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#264653',
    borderRadius: 24,
  },
  dropdownHeaderClosed: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    fontFamily: 'BodoniFLF',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  dropdownText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    paddingVertical: 4,
  },
  listItemText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 8,
  },
}); 