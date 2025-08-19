// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Icon from "react-native-vector-icons/Ionicons";
// import Voice from "@react-native-voice/voice";
// import { useNavigation } from "@react-navigation/native";

// const SpeakingLesson = () => {
//   const navigation = useNavigation();
//   const [isRecording, setIsRecording] = useState(false);
//   const [results, setResults] = useState<string[]>([]);
//   const [correctCount, setCorrectCount] = useState(0);

//   const targetWord = "おはよう";

//   useEffect(() => {
//     Voice.onSpeechResults = (e) => {
//       setResults(e.value || []);
//     };
//     Voice.onSpeechError = (e) => {
//       console.error("Voice error:", e);
//     };
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const startListening = async () => {
//     try {
//       setResults([]);
//       setIsRecording(true);
//       await Voice.start("ja-JP"); // tiếng Nhật
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//       setIsRecording(false);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleCheck = () => {
//     if (results.some((res) => res.includes(targetWord))) {
//       Alert.alert("Chính xác!", "Bạn đã phát âm đúng 🎉");
//       setCorrectCount((prev) => prev + 1);
//     } else {
//       Alert.alert("Sai rồi 😢", "Hãy thử lại");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={styles.content}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back" size={24} color="#666" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Luyện nói</Text>
//         </View>

//         <View style={styles.questionCard}>
//           <Text style={styles.instruction}>Phát âm từ sau:</Text>
//           <Text style={styles.word}>{targetWord}</Text>

//           <TouchableOpacity
//             style={[styles.micButton, isRecording && styles.micActive]}
//             onPress={isRecording ? stopListening : startListening}
//           >
//             <Icon name="mic-outline" size={24} color="#fff" />
//             <Text style={styles.micText}>
//               {isRecording ? "Đang nghe..." : "Bấm để nói"}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.results}>
//             <Text style={styles.resultLabel}>Bạn đã nói:</Text>
//             {results.map((r, index) => (
//               <Text key={index} style={styles.resultText}>
//                 {r}
//               </Text>
//             ))}
//           </View>

//           <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
//             <Text style={styles.checkButtonText}>Kiểm tra</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   content: { padding: 10 },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "500",
//     color: "#333",
//     marginLeft: 10,
//   },
//   questionCard: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 20,
//     marginTop: 20,
//     elevation: 2,
//   },
//   instruction: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#666",
//   },
//   word: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#FFC1CC",
//     textAlign: "center",
//     marginVertical: 20,
//   },
//   micButton: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFC1CC",
//     padding: 15,
//     borderRadius: 50,
//     alignSelf: "center",
//   },
//   micActive: {
//     backgroundColor: "#FF69B4",
//   },
//   micText: {
//     color: "#fff",
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   results: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   resultLabel: {
//     fontSize: 14,
//     color: "#666",
//   },
//   resultText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//   },
//   checkButton: {
//     backgroundColor: "#34C759",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     marginTop: 20,
//     alignSelf: "center",
//   },
//   checkButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default SpeakingLesson;
