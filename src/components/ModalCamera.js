import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1E88E5';

export default function ModalCamera({ visible, onClose, onResult }) {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [torch, setTorch] = useState('off');
  const [scanning, setScanning] = useState(true);
  const [cameraPosition, setCameraPosition] = useState('back');

  const activeDevice = useCameraDevice(cameraPosition);

  useEffect(() => {
    const ensurePermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status !== 'granted') {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'granted');
      } else {
        setHasPermission(true);
      }
    };
    if (visible) {
      ensurePermission();
      setScanning(true);
    }
  }, [visible]);

  const codeScanner = useCodeScanner({
    codeTypes: [
      'ean-13',
      'ean-8',
      'qr',
      'code-128',
      'upc-a',
      'upc-e',
      'code-39',
      'code-93',
    ],
    onCodeScanned: codes => {
      if (!scanning || !codes.length) return;
      const value = codes[0]?.value;
      if (value) {
        onResult?.(value);
      }
    },
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Scan Barcode</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Icon name="close" size={22} color="#334155" />
          </TouchableOpacity>
        </View>

        {!activeDevice || !hasPermission ? (
          <View style={styles.permissionBox}>
            <Icon name="camera-off" size={36} color="#64748b" />
            <Text style={styles.permissionText}>
              {activeDevice
                ? 'Izin kamera diperlukan'
                : 'Kamera tidak tersedia'}
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={async () => {
                const res = await Camera.requestCameraPermission();
                setHasPermission(res === 'granted');
              }}
            >
              <Text style={styles.primaryBtnText}>Berikan Izin</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraWrap}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={activeDevice}
              isActive={visible}
              torch={torch}
              codeScanner={codeScanner}
            />
            <View style={styles.overlay}>
              <View style={styles.frame} />
              <Text style={styles.hint}>Arahkan barcode ke dalam kotak</Text>
            </View>
          </View>
        )}

        <View style={styles.toolbar}>
          {activeDevice?.hasTorch && (
            <TouchableOpacity
              style={[styles.toolBtn, torch === 'on' && styles.toolBtnActive]}
              onPress={() => setTorch(prev => (prev === 'on' ? 'off' : 'on'))}
            >
              <Icon
                name={torch === 'on' ? 'flash' : 'flash-off'}
                size={20}
                color={torch === 'on' ? '#fff' : '#334155'}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => setScanning(true)}
          >
            <Icon name="refresh" size={20} color="#334155" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() =>
              setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'))
            }
          >
            <Icon name="camera-flip" size={20} color="#334155" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  closeBtn: { padding: 6 },
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  permissionText: { marginTop: 8, color: '#334155' },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  cameraWrap: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: '#00BCD4',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  hint: { color: '#e2e8f0', marginTop: 10 },
  toolbar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  toolBtn: {
    backgroundColor: '#fff',
    borderRadius: 22,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnActive: { backgroundColor: PRIMARY },
});
