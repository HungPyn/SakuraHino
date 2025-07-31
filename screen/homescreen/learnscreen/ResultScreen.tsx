// File: src/screen/homescreen/learnscreen/ResultScreen.tsx
// Hoặc đường dẫn phù hợp với cấu trúc dự án của bạn

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// Đảm bảo đường dẫn này đúng tới file types của bạn
import type { RootStackParamList } from '../../../types/navigatorType';

// --- Định nghĩa kiểu cho props của màn hình này ---
// `ResultScreenRouteProp` để lấy các tham số từ route
type ResultScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Result'>['route'];
// `ResultScreenNavigationProp` để điều hướng
type ResultScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Result'>['navigation'];

const ResultScreen = () => {
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const route = useRoute<ResultScreenRouteProp>();

  // Lấy các tham số từ màn hình LessonScreen hoặc nơi gọi đến ResultScreen
  // Đảm bảo rằng route.params sẽ có các thuộc tính này nhờ vào RootStackParamList
  const { type, xp, commitTime } = route.params;

  // Xử lý khi người dùng muốn quay về màn hình học tập (LearningPathScreen)
  const handleGoToLearningPath = () => {
    // Sử dụng `replace` để người dùng không thể quay lại màn hình kết quả bằng nút back
    // Điều hướng đến màn hình LearningPathScreen. Tên màn hình phải khớp chính xác với RootStackParamList
    navigation.replace('LearningPathScreen');
    // Hoặc nếu bạn muốn quay về màn hình Main chứa Tab Navigator và chuyển đến tab 'Học tập':
    // navigation.replace('Main', { screen: 'Học tập' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kết Quả Bài Học</Text>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>Loại kết quả: **{type.toUpperCase()}**</Text>
        <Text style={styles.resultText}>XP nhận được: **+{xp} XP**</Text>
        <Text style={styles.resultText}>Thời gian hoàn thành: {commitTime}</Text>
      </View>

      <Button
        title="Tiếp tục học"
        onPress={handleGoToLearningPath}
        color="#4CAF50" // Màu xanh lá cây
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7', // Nền màu sáng
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  resultBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    width: '90%',
  },
  resultText: {
    fontSize: 20,
    marginBottom: 10,
    color: '#555',
    textAlign: 'center',
  },
});

export default ResultScreen;