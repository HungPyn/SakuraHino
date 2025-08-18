// // screens/ResultScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const ResultScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { type, xp, commitTime } = route.params; // Passed from LearningScreen

//   const renderContent = () => {
//     if (type === 'perfect') {
//       return (
//         <>
//           <Text style={styles.resultTitle}>Perfect lesson!</Text>
//           <Text style={styles.resultSubtitle}>You made no mistakes in this lesson</Text>
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statLabel}>TOTAL XP</Text>
//               <View style={styles.statValueBox}>
//                 <Text style={styles.statValue}>{xp}</Text>
//               </View>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statLabel}>COMMITTED</Text>
//               <View style={styles.statValueBox}>
//                 <Text style={styles.statValue}>{commitTime}</Text>
//               </View>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statLabel}>AMAZING</Text>
//               <View style={styles.statValueBox}>
//                 <Text style={styles.statValue}>100%</Text>
//               </View>
//             </View>
//           </View>
//           <Image
//             source={{ uri: 'https://via.placeholder.com/150' }} // Duolingo characters for perfect
//             style={styles.resultImage}
//           />
//         </>
//       );
//     } else if (type === 'genius') {
//       return (
//         <>
//           <Image
//             source={{ uri: 'https://via.placeholder.com/150' }} // Duolingo character for genius
//             style={styles.resultImage}
//           />
//           <Text style={styles.resultTitle}>Genius! Are you a secret agent, like I was in the 80s?</Text>
//           <Text style={styles.subtitleSmall}>5 in a row!</Text>
//         </>
//       );
//     }
//     // Add other result types (e.g., 'incorrect')
//   };

//   return (
//     <View style={[styles.container, type === 'perfect' ? styles.perfectBg : styles.geniusBg]}>
//       {renderContent()}
//       <TouchableOpacity
//         style={styles.continueButton}
//         onPress={() => navigation.popToTop()} // Go back to the main learning path
//       >
//         <Text style={styles.continueButtonText}>CONTINUE</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   perfectBg: {
//     backgroundColor: '#A7EF00', // Duolingo green background
//   },
//   geniusBg: {
//     backgroundColor: '#58CC02', // Another shade of Duolingo green
//   },
//   resultTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   resultSubtitle: {
//     fontSize: 18,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   subtitleSmall: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//     marginBottom: 30,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 40,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginBottom: 5,
//   },
//   statValueBox: {
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   statValue: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   resultImage: {
//     width: 150,
//     height: 150,
//     resizeMode: 'contain',
//     marginBottom: 40,
//   },
//   continueButton: {
//     backgroundColor: '#fff',
//     paddingVertical: 18,
//     width: '100%',
//     borderRadius: 10,
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 30,
//   },
//   continueButtonText: {
//     color: '#60C900', // Duolingo green
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default ResultScreen;
