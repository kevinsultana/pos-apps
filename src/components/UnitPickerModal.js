import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UnitPickerModal = ({
  visible,
  onClose,
  units,
  unitsLoading,
  onSelectUnit,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pilih Unit</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={units}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.unitItem}
              onPress={() => {
                onSelectUnit(item.id);
                onClose();
              }}
            >
              <Text style={styles.unitItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {unitsLoading ? 'Memuat unit...' : 'Tidak ada unit tersedia'}
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6eef8',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
  },
  unitItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  unitItemText: {
    fontSize: 16,
    color: '#0f172a',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default UnitPickerModal;
