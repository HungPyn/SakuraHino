// screens/LearningScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import your icons (e.g., using react-native-vector-icons or local assets)
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const dummySentence = {
  id: '1',
  text: 'Yo como, tú comes, él come.',
  words: ['Yo', 'como', 'tú', 'comes', 'él', 'come'],
  correctTranslation: ['I', 'eat', 'you', 'eat', 'he', 'eats'],
  // For a word bank, you'd have options:
  wordBankOptions: ['you', 'eats', 'eat', 'I', 'am', 'woman', 'water', 'he', 'she'],
};

const LearningScreen = () => {
  const navigation = useNavigation();
  const [selectedWords, setSelectedWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(dummySentence);
  const [lives, setLives] = useState(5);
  const [progress, setProgress] = useState(0.5); // Example progress

  const handleWordSelect = (word) => {
    setSelectedWords([...selectedWords, word]);
  };

  const handleWordRemove = (index) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords.splice(index, 1);
    setSelectedWords(newSelectedWords);
  };

  const checkAnswer = () => {
    // Basic check: Join selected words and compare.
    // In a real app, you'd have more sophisticated matching.
    const userAnswer = selectedWords.join(' ');
    const correctAnswer = currentQuestion.correctTranslation.join(' ');

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      // Correct!
      navigation.navigate('Result', { type: 'perfect', xp: 15, commitTime: '6:55' });
    } else {
      // Incorrect, reduce life, maybe show a hint.
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        // Game over or retry logic
        alert('Game Over! You ran out of lives.');
      }
      // You'd typically show a "Try again" message here or highlight incorrect words
      alert('Incorrect! Try again.');
    }
  };

  const renderWordBankItem = ({ item }) => (
    <TouchableOpacity
      style={styles.wordBankButton}
      onPress={() => handleWordSelect(item)}
      disabled={selectedWords.includes(item)} // Disable if already selected (simple check)
    >
      <Text style={styles.wordBankButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Text style={{ fontSize: 24 }}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.livesContainer}>
          {/* You'd use an actual heart icon here */}
          <Text style={{ fontSize: 20, marginRight: 5 }}>❤️</Text>
          <Text style={styles.livesText}>{lives}</Text>
        </View>
      </View>

      {/* Question Area */}
      <View style={styles.questionArea}>
        <Text style={styles.questionTitle}>Translate this sentence</Text>
        <View style={styles.sentenceContainer}>
          {/* This is where your Duolingo character goes */}
          <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.duoCharacter} />
          <View style={styles.dialogBubble}>
            <TouchableOpacity onPress={() => {/* Play audio */}}>
              {/* Audio icon */}
              <Text style={{ fontSize: 20 }}>🔊</Text>
            </TouchableOpacity>
            <Text style={styles.sentenceText}>{currentQuestion.text}</Text>
          </View>
        </View>
      </View>

      {/* Selected Words / Input Area */}
      <View style={styles.selectedWordsContainer}>
        {selectedWords.map((word, index) => (
          <TouchableOpacity key={index} style={styles.selectedWordTag} onPress={() => handleWordRemove(index)}>
            <Text style={styles.selectedWordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Word Bank */}
      <View style={styles.wordBankContainer}>
        <FlatList
          data={currentQuestion.wordBankOptions}
          renderItem={renderWordBankItem}
          keyExtractor={(item) => item}
          numColumns={3} // Adjust as needed
          columnWrapperStyle={styles.row}
        />
      </View>

      {/* Check Button */}
      <TouchableOpacity
        style={[styles.checkButton, selectedWords.length === 0 && styles.checkButtonDisabled]}
        onPress={checkAnswer}
        disabled={selectedWords.length === 0}
      >
        <Text style={styles.checkButtonText}>CHECK</Text>
      </TouchableOpacity>
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
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    flexShrink: 1, // Allow text to wrap
  },
  selectedWordsContainer: {
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  selectedWordTag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
  },
  selectedWordText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  wordBankContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  wordBankButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 15,
    margin: 5,
    minWidth: (width - 60) / 3.5, // Distribute evenly
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBankButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkButton: {
    backgroundColor: '#60C900', // Duolingo green
    paddingVertical: 18,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  checkButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LearningScreen;