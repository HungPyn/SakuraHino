import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Alert, // Dùng Alert thay vì alert()
  Animated, // Để thêm hiệu ứng nhỏ
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Nếu bạn muốn dùng icon thực tế, hãy cài đặt react-native-vector-icons:
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// Dữ liệu câu hỏi mẫu - trong thực tế sẽ lấy từ API/DB
const allSentences = [
  {
    id: '1',
    text: 'Yo como, tú comes, él come.',
    words: ['Yo', 'como', 'tú', 'comes', 'él', 'come'],
    correctTranslation: ['I', 'eat', 'you', 'eat', 'he', 'eats'],
    wordBankOptions: ['you', 'eats', 'eat', 'I', 'am', 'woman', 'water', 'he', 'she'],
  },
  {
    id: '2',
    text: 'Ella bebe agua.',
    words: ['Ella', 'bebe', 'agua'],
    correctTranslation: ['She', 'drinks', 'water'],
    wordBankOptions: ['She', 'drinks', 'water', 'eats', 'milk', 'he', 'boy'],
  },
  {
    id: '3',
    text: 'Nosotros hablamos español.',
    words: ['Nosotros', 'hablamos', 'español'],
    correctTranslation: ['We', 'speak', 'Spanish'],
    wordBankOptions: ['We', 'speak', 'Spanish', 'read', 'book', 'they', 'english'],
  },
];

const LearningScreen = () => {
  const navigation = useNavigation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(allSentences[0]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [lives, setLives] = useState(5);
  const [progress, setProgress] = useState(0); // Bắt đầu từ 0
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAttempt, setIsCorrectAttempt] = useState(false);
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  // Cập nhật câu hỏi và tiến độ khi currentQuestionIndex thay đổi
  useEffect(() => {
    if (currentQuestionIndex < allSentences.length) {
      setCurrentQuestion(allSentences[currentQuestionIndex]);
      setSelectedWords([]); // Reset selected words for new question
      setProgress((currentQuestionIndex + 1) / allSentences.length);
      setShowFeedback(false);
      setIsCorrectAttempt(false);
    } else {
      // Hoàn thành tất cả câu hỏi
      Alert.alert(
        'Chúc mừng!',
        'Bạn đã hoàn thành tất cả các bài học!',
        [{ text: 'Về nhà', onPress: () => navigation.popToTop() }]
      );
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (showFeedback) {
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showFeedback]);

  const handleWordSelect = (word) => {
    if (showFeedback) return; // Không cho chọn khi đang hiển thị feedback
    setSelectedWords([...selectedWords, word]);
  };

  const handleWordRemove = (index) => {
    if (showFeedback) return; // Không cho xóa khi đang hiển thị feedback
    const newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
  };

  const checkAnswer = () => {
    const userAnswerArray = selectedWords.map(word => word.toLowerCase());
    const correctAnswerArray = currentQuestion.correctTranslation.map(word => word.toLowerCase());

    // Kiểm tra độ dài và từng từ theo thứ tự
    let correct = true;
    if (userAnswerArray.length !== correctAnswerArray.length) {
      correct = false;
    } else {
      for (let i = 0; i < userAnswerArray.length; i++) {
        if (userAnswerArray[i] !== correctAnswerArray[i]) {
          correct = false;
          break;
        }
      }
    }

    setIsCorrectAttempt(correct);
    setShowFeedback(true);

    if (correct) {
      // Correct!
      // Chuyển sang câu tiếp theo sau một khoảng thời gian
      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        navigation.navigate('Result', { type: 'perfect', xp: 15, commitTime: '6:55' }); // Vẫn điều hướng
      }, 1000); // Đợi 1 giây để người dùng thấy feedback
    } else {
      // Incorrect, reduce life
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          Alert.alert(
            'Thua cuộc!',
            'Bạn đã hết mạng. Hãy thử lại từ đầu!',
            [{ text: 'Thử lại', onPress: () => navigation.popToTop() }] // Quay về màn hình chính hoặc bắt đầu lại bài học
          );
        }
        return newLives;
      });
    }
  };

  const tryAgain = () => {
    setSelectedWords([]); // Xóa các từ đã chọn
    setShowFeedback(false); // Ẩn feedback
  };

  const renderWordBankItem = ({ item }) => {
    const isSelected = selectedWords.includes(item);
    return (
      <TouchableOpacity
        style={[styles.wordBankButton, isSelected && styles.wordBankButtonSelected]}
        onPress={() => handleWordSelect(item)}
        disabled={isSelected || showFeedback} // Vô hiệu hóa khi đã chọn hoặc đang hiển thị feedback
      >
        <Text style={styles.wordBankButtonText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          {/* Thay bằng Icon thực tế nếu có */}
          <Text style={{ fontSize: 24, color: '#4A4A4A' }}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.livesContainer}>
          {/* Thay bằng Icon trái tim thực tế nếu có */}
          <Text style={{ fontSize: 20, marginRight: 5 }}>❤️</Text>
          <Text style={styles.livesText}>{lives}</Text>
        </View>
      </View>

      {/* Question Area */}
      <View style={styles.questionArea}>
        <Text style={styles.questionTitle}>Translate this sentence</Text>
        <View style={styles.sentenceContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }} // Placeholder cho nhân vật Duolingo
            style={styles.duoCharacter}
          />
          <View style={styles.dialogBubble}>
            <TouchableOpacity onPress={() => { /* Play audio */ }}>
              {/* Thay bằng Icon loa thực tế nếu có */}
              <Text style={{ fontSize: 20, color: '#4A4A4A' }}>🔊</Text>
            </TouchableOpacity>
            <Text style={styles.sentenceText}>{currentQuestion.text}</Text>
          </View>
        </View>
      </View>

      {/* Selected Words / Input Area */}
      <View style={styles.selectedWordsContainer}>
        {selectedWords.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.selectedWordTag, showFeedback && !isCorrectAttempt && styles.selectedWordTagIncorrect]}
            onPress={() => handleWordRemove(index)}
            disabled={showFeedback} // Vô hiệu hóa khi đang hiển thị feedback
          >
            <Text style={styles.selectedWordText}>{word}</Text>
          </TouchableOpacity>
        ))}
        {selectedWords.length === 0 && (
          <Text style={styles.placeholderText}>Chạm vào các từ bên dưới</Text>
        )}
      </View>

      {/* Word Bank */}
      <View style={styles.wordBankContainer}>
        <FlatList
          data={currentQuestion.wordBankOptions}
          renderItem={renderWordBankItem}
          keyExtractor={(item, index) => `${item}-${index}`} // Thêm index để đảm bảo key duy nhất nếu có từ trùng lặp
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
      </View>

      {/* Feedback & Check Button */}
      {showFeedback ? (
        <Animated.View style={[styles.feedbackContainer, { opacity: feedbackOpacity, backgroundColor: isCorrectAttempt ? '#D7FFB8' : '#FFDFD9' }]}>
          <View style={styles.feedbackContent}>
            <Text style={[styles.feedbackText, { color: isCorrectAttempt ? '#58CC02' : '#EA2B2B' }]}>
              {isCorrectAttempt ? 'Chính xác!' : 'Sai rồi!'}
            </Text>
            {!isCorrectAttempt && (
              <Text style={styles.correctAnswerText}>
                Đáp án đúng: {currentQuestion.correctTranslation.join(' ')}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: isCorrectAttempt ? '#58CC02' : '#FF4B4B' }]}
            onPress={isCorrectAttempt ? () => setCurrentQuestionIndex(prevIndex => prevIndex + 1) : tryAgain}
          >
            <Text style={styles.continueButtonText}>
              {isCorrectAttempt ? 'TIẾP TỤC' : 'THỬ LẠI'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <TouchableOpacity
          style={[styles.checkButton, selectedWords.length === 0 && styles.checkButtonDisabled]}
          onPress={checkAnswer}
          disabled={selectedWords.length === 0}
        >
          <Text style={styles.checkButtonText}>KIỂM TRA</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40, // Adjust for status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  headerIcon: {
    padding: 5,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#60C900', // Duolingo green
    borderRadius: 5,
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4B4B', // Red for lives
  },
  questionArea: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  duoCharacter: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
  },
  dialogBubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sentenceText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    flexShrink: 1, // Allow text to wrap
    color: '#333',
  },
  selectedWordsContainer: {
    minHeight: 80,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center', // Canh giữa các từ đã chọn
  },
  selectedWordTag: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  selectedWordTagIncorrect: {
    backgroundColor: '#FFD9D9', // Màu đỏ nhạt cho từ sai
    borderColor: '#FF4B4B',
    borderWidth: 1,
  },
  selectedWordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderText: {
    fontSize: 18,
    color: '#A0A0A0',
    marginTop: 15,
  },
  wordBankContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  row: {
    justifyContent: 'center', // Canh giữa các nút từ
    marginBottom: 10,
  },
  wordBankButton: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    margin: 5,
    minWidth: (width - 70) / 3, // Phân phối đều hơn cho 3 cột
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  wordBankButtonSelected: {
    backgroundColor: '#D0D0D0', // Màu nhạt hơn khi đã chọn
    borderColor: '#B0B0B0',
  },
  wordBankButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkButton: {
    backgroundColor: '#58CC02', // Duolingo green
    paddingVertical: 18,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  checkButtonDisabled: {
    backgroundColor: '#B2B2B2',
    shadowOpacity: 0,
    elevation: 0,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor được đặt động
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  feedbackContent: {
    marginBottom: 15,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  correctAnswerText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  continueButton: {
    // backgroundColor được đặt động
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default LearningScreen;