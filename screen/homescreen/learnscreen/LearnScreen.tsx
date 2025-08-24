import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import {
  BigCloseSvg,
  BoySvg,
  CloseSvg,
  DoneSvg,
  LessonFastForwardEndFailSvg,
  LessonFastForwardEndPassSvg,
  LessonFastForwardStartSvg,
  LessonTopBarEmptyHeart,
  LessonTopBarHeart,
  WomanSvg,
} from "../../../components/Svgs";
import { useBoundStore } from "../../../hooks/useBoundStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigatorType";
import questionService from "../../../services/questionService";
import Pronunciation from "../learningComponents/Pronunciation";
import Writing from "../learningComponents/Writing";
import WordOrder from "../learningComponents/WordOrder";
import AudioChoice from "../learningComponents/AudioChoice";
import SelectText from "../learningComponents/SelectText";
import SelectImage from "../learningComponents/SelectImage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// Định nghĩa kiểu cho navigation và route
type LessonScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Lesson"
>["navigation"];
type LessonScreenRouteProp = any;

// Dữ liệu câu hỏi giả định
const lessonProblem1 = {
  type: "SELECT_1_OF_3",
  question: `Đâu là một bé trai"?`,
  answers: [
    { icon: <BoySvg />, name: "男の子" },
    { icon: <WomanSvg />, name: "女の人" },
  ],
  correctAnswer: 0,
} as const;

const lessonProblem2 = {
  type: "WRITE_IN_ENGLISH",
  question: "Đứa trẻ",
  answerTiles: ["女の人", "牛乳", "水", "私", "その", "男の子"],
  correctAnswer: [4, 5],
} as const;

const lessonProblems = [lessonProblem1, lessonProblem2];

const numbersEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

const formatTime = (timeMs: number): string => {
  const seconds = Math.floor(timeMs / 1000) % 60;
  const minutes = Math.floor(timeMs / 1000 / 60) % 60;
  const hours = Math.floor(timeMs / 1000 / 60 / 60);
  if (hours === 0)
    return [minutes, seconds]
      .map((x) => x.toString().padStart(2, "0"))
      .join(":");
  return [hours, minutes, seconds]
    .map((x) => x.toString().padStart(2, "0"))
    .join(":");
};

type QuestionResult = {
  question: string;
  yourResponse: string;
  correctResponse: string;
};

export enum QuestionType {
  MULTIPLE_CHOICE_VOCAB_IMAGE = "MULTIPLE_CHOICE_VOCAB_IMAGE",
  MULTIPLE_CHOICE_TEXT_ONLY = "MULTIPLE_CHOICE_TEXT_ONLY",
  AUDIO_CHOICE = "AUDIO_CHOICE",
  WORD_ORDER = "WORD_ORDER",
  PRONUNCIATION = "PRONUNCIATION",
  WRITING = "WRITING",
}

export interface Choice {
  id: number;
  lessonQuestionId: number | null;
  textForeign: string;
  textRomaji?: string | null;
  imageUrl?: string | null;
  audioUrlForeign?: string | null;
  isCorrect: boolean;
  meaning?: string | null;
  items?: string[]; // Thêm thuộc tính 'items' với kiểu là một mảng chuỗi
}

export interface Question {
  id: number;
  lessonId: number;
  questionType: QuestionType;
  status: "PUBLISHED" | "PENDING" | "DELETED";
  promptTextTemplate: string;
  targetWordNative: string;
  targetLanguageCode: string; // "vi", "ja-JP", "en-US", ...
  audioUrl?: string | null;
  choices?: Choice[];
}

export const playCorrectSound = async (filePath: any) => {
  try {
    const { sound } = await Audio.Sound.createAsync(filePath);
    await sound.playAsync();

    // Giải phóng bộ nhớ khi phát xong
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log("Lỗi phát âm thanh:", error);
  }
};
type SelectStringAnswer = (answer: string[]) => void;

// =========================================================================
//                                MAIN COMPONENT
// =========================================================================

const Lesson = () => {
  const navigation = useNavigation<LessonScreenNavigationProp>();
  const route = useRoute<LessonScreenRouteProp>();

  const [lessonProblem, setLessonProblem] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Choice | null>(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [quitMessageShown, setQuitMessageShown] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false); // Thêm state này
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false); // Thêm state này
  const [disableChild, setDisableChild] = useState(false);
  const [isRetryingIncorrect, setIsRetryingIncorrect] = useState(false);
  const startTime = useRef(Date.now());
  const endTime = useRef(startTime.current + 1000 * 60 * 3 + 1000 * 33);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);
  const [isStartingLesson, setIsStartingLesson] = useState(true);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [onePoint, setOnePoint] = useState(0);
  const [originalQuestionsLength, setOriginalQuestionsLength] =
    useState<number>(0); // chỉ 1 số thôi

  //lưu câu đúng cho thông báo sai
  const [correctAnswerText, setCorrectAnswerText] = useState<Choice | null>(
    null
  );
  //luu cau sai
  const [questionIncorrect, setQuestionIncorrect] = useState<Question[]>([]);
  const { lessonCode, topicCode, practice } = route.params;

  //lưu kết quả lesson
  const createResultLesson = async () => {
    const result = {
      lessonCode,
      score,
      totalQuestion: originalQuestionsLength,
      correctCount: correctAnswerCount,
      wrongCount: incorrectAnswerCount,
      durationSeconds: Math.floor((endTime.current - startTime.current) / 1000),
    };
    try {
      const response = await questionService.createResultLesson(result);
      console.log("Kết quả đã lưu:", response);
    } catch (error) {
      console.error("Lỗi khi lưu kết quả câu hỏi:", error);
    }
  };
  //lưu kết quả ôn tập
  const createResultPractice = async () => {
    const result = {
      topicCode,
      score,
      totalQuestion: originalQuestionsLength,
      correctCount: correctAnswerCount,
      wrongCount: incorrectAnswerCount,
      durationSeconds: Math.floor((endTime.current - startTime.current) / 1000),
    };
    try {
      const response = await questionService.createResultPractice(result);

      console.log("Kết quả đã lưu:", response);
    } catch (error) {
      console.error("Lỗi khi lưu kết quả câu hỏi ôn tập:", error);
    }
  };
  ///
  const onSkip = async () => {
    setSelectedAnswer(null);
    setCorrectAnswerShown(true);
    setIsAnswerChecked(false);
    setSelectedAnswers([]);
    setCorrectAnswerText(null);

    if (currentQuestionIndex === questions.length - 1) {
      if (!isRetryingIncorrect && questionIncorrect.length > 0) {
        setQuestions([...questions, ...questionIncorrect]);
        setCurrentQuestionIndex(originalQuestionsLength); // bắt đầu từ câu đầu của các câu sai
        setIsRetryingIncorrect(true);
        console.log("lam lai cau sai");
      } else {
        endTime.current = Date.now();
        // kết thúc bài học, show tổng kết
        console.log("Kết thúc bài học hiển thị màn tổng kết:");
        console.log("Điểm số là:", score);
        console.log(
          "Thời gian làm bài là:",
          (endTime.current - startTime.current) / 1000,
          "giây"
        );
        console.log("tổng số câu là:", originalQuestionsLength);
        console.log("số câu đúng là:", correctAnswerCount);
        console.log("số câu sai là:", incorrectAnswerCount);
        const commitTime = formatTime(endTime.current - startTime.current);
        if (practice) {
          await createResultPractice();
        } else {
          await createResultLesson();
        }

        navigation.replace("Result", {
          isTest: false,
          corect: correctAnswerCount,
          totalQuestion: originalQuestionsLength,
          score: score,
          commitTime: commitTime,
        });
      }
    } else {
      // next câu tiếp theo
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      if (
        !isRetryingIncorrect &&
        currentQuestion.questionType === QuestionType.PRONUNCIATION
      ) {
        setIncorrectAnswerCount((prevCount) => prevCount + 1);
      }
    }
  };

  //lay question
  // 1. Khai báo tất cả các state cần thiết
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const getQuestions = async () => {
    try {
      const questions = await questionService.getQuestion(lessonCode);
      setQuestions(questions);
      setOriginalQuestionsLength(questions.length); // Lưu lại độ dài ban đầu của mảng câu hỏi

      console.log("Độ dài ban đầu của mảng câu hỏi:", questions.length);
      // Bổ sung logic tính toán điểm
      if (questions.length > 0) {
        const calculatedPoints = 100 / questions.length;
        setOnePoint(calculatedPoints);
        console.log("Điểm mỗi câu là:", calculatedPoints);
        // console.log("Câu hỏi bài học là", JSON.stringify(questions, null, 2));
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy câu hỏi:", error);
    }
  };
  const getPracticeQuestions = async () => {
    try {
      const questions = await questionService.getPracticeQuestions(
        topicCode,
        15
      );
      setQuestions(questions);
      setOriginalQuestionsLength(questions.length); // Lưu lại độ dài ban đầu của mảng câu hỏi

      console.log("Độ dài ban đầu của mảng câu hỏi:", questions.length);
      // Bổ sung logic tính toán điểm
      if (questions.length > 0) {
        const calculatedPoints = 100 / questions.length;
        setOnePoint(calculatedPoints);
        console.log("Điểm mỗi câu là:", calculatedPoints);
        // console.log("câu hỏi ôn tập là:", JSON.stringify(questions, null, 2));
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy câu hỏi ôn tập:", error);
    }
  };
  useEffect(() => {
    if (practice) {
      console.log("Đây là dữ liệu ôn tập nhé:");
      console.log("topicCode là:", topicCode);
      console.log("practice là:", practice);
      console.log("lessonCode là:", lessonCode);
      getPracticeQuestions();
    } else {
      console.log("Đây là dữ liệu học tập bình thường nhé:");
      console.log("lesson: topicCode là:", topicCode);
      console.log("lesson: practice là:", practice);
      console.log("lesson: lessonCode là:", lessonCode);
      getQuestions();
    }
  }, [lessonCode, topicCode]); // Sẽ chạy một lần khi lessonCode có giá trị

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Đang tải bài học...</Text>

        {/* Nút Quay lại */}
        <TouchableOpacity
          onPress={() => navigation.navigate("LearningPathScreen")}
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#ccc",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
            Quay lại
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const hearts =
    "fast-forward" in route.params &&
    !isNaN(Number(route.params["fast-forward"]))
      ? 3 - incorrectAnswerCount
      : null;

  // Tìm đáp án đúng từ dữ liệu API mới
  const correctAnswer = currentQuestion.choices?.find(
    (choice) => choice.isCorrect
  );
  // So sánh đáp án được chọn với đáp án đúng
  // const isAnswerCorrect =
  //   selectedAnswer && correctAnswer && selectedAnswer.id === correctAnswer.id;

  //hàm
  // Hàm kiểm tra đáp án đã được cập nhật
  const onCheckAnswer = () => {
    if (
      currentQuestion.questionType === QuestionType.MULTIPLE_CHOICE_TEXT_ONLY ||
      currentQuestion.questionType ===
        QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE ||
      currentQuestion.questionType === QuestionType.AUDIO_CHOICE
    ) {
      if (selectedAnswer?.isCorrect == true) {
        playCorrectSound(require("../sound/soundCorect.mp3"));
        setIsCorrectAnswer(true);
        setIsAnswerChecked(true);
        setSelectedAnswer(null);
        if (isRetryingIncorrect) {
          setScore((prev) => prev + 5);
          setScore((prev) => prev + onePoint / 2);
          setCorrectAnswerCount((x) => x + 1);
          setIncorrectAnswerCount((x) => x - 1);
        } else {
          setScore((prev) => prev + onePoint);
          setCorrectAnswerCount((x) => x + 1);
        }
      } else {
        setIsCorrectAnswer(false);
        setIsAnswerChecked(true);
        setSelectedAnswer(null);
        setQuestionIncorrect((prev) => [...prev, currentQuestion]);
        if (!isRetryingIncorrect) {
          setIncorrectAnswerCount((x) => x + 1);
        }
      }
    }
    // check cho câu hỏi sắp xếp
    if (currentQuestion.questionType === QuestionType.WORD_ORDER) {
      function isJapanese(text: string) {
        // Biểu thức chính quy cho phép Hiragana, Katakana, Kanji, dấu cách và các dấu câu thông thường
        return /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\s\p{P}ー]+$/u.test(
          text
        );
      }
      const findCorrectAnswerChoice = () => {
        if (!currentQuestion.choices || currentQuestion.choices.length === 0) {
          return null;
        }

        if (currentQuestion.choices.length === 1) {
          return currentQuestion.choices[0];
        }

        const foundChoice = currentQuestion.choices.find(
          (choice) => choice.isCorrect
        );

        return foundChoice ?? null;
      };

      const correctChoice = findCorrectAnswerChoice();
      let tuSoSanh = "";
      if (isJapanese(selectedWords.join(""))) {
        tuSoSanh = correctChoice?.textForeign || "";
      } else {
        tuSoSanh = correctChoice?.meaning || "";
      }

      console.log("Word để so sánh là:", tuSoSanh);
      console.log("Selected Words là:", selectedWords);
      const selectedSequence: string = selectedWords
        .join("")
        .replace(/\s+/g, "");

      const targetSequence: string = tuSoSanh.replace(/\s+/g, "");

      // So sánh thứ tự các chữ (bỏ khoảng trắng)
      const isCorrect: boolean = targetSequence === selectedSequence;

      // Log ra để kiểm tra
      console.log("Target:", targetSequence); // Chuỗi chuẩn từ currentQuestion.targetWordNative
      console.log("Selected:", selectedSequence); // Chuỗi nối từ selectedWords
      console.log("Kết quả:", isCorrect ? "Đúng ✅" : "Sai ❌");

      if (isCorrect) {
        playCorrectSound(require("../sound/soundCorect.mp3"));
        setIsCorrectAnswer(true);
        setIsAnswerChecked(true);
        setSelectedWords([]);
        if (isRetryingIncorrect) {
          setScore((prev) => prev + onePoint / 2);
          setCorrectAnswerCount((x) => x + 1);
          setIncorrectAnswerCount((x) => x - 1);
        } else {
          setScore((prev) => prev + onePoint);
          setCorrectAnswerCount((x) => x + 1);
        }
      } else {
        setIsCorrectAnswer(false);
        setIsAnswerChecked(true);
        setSelectedAnswer(null);
        setQuestionIncorrect((prev) => [...prev, currentQuestion]);
        if (!isRetryingIncorrect) {
          setIncorrectAnswerCount((x) => x + 1);
        }
      }
    }
    //check câu viết
    if (currentQuestion.questionType === QuestionType.WRITING) {
      // BƯỚC 1: CHUẨN HÓA VÀ LÀM SẠCH CHUỖI ĐẦU VÀO
      const target = currentQuestion.targetWordNative?.trim().normalize("NFC");
      const input = (selectedWords[0] || "")?.trim().normalize("NFC");

      // BƯỚC 2: SO SÁNH TRỰC TIẾP TRƯỚC TIÊN
      const isCorrect = (() => {
        if (!target || !input) return false;

        // So sánh trực tiếp để xử lý trường hợp đúng 100%
        if (target === input) {
          return true;
        }

        // Nếu không khớp hoàn toàn, sử dụng thuật toán Levenshtein distance
        const longer = target.length > input.length ? target : input;
        const shorter = target.length > input.length ? input : target;
        const longerLength = longer.length;

        const matrix = Array.from({ length: shorter.length + 1 }, (_, i) =>
          Array(longer.length + 1).fill(0)
        );
        for (let i = 0; i <= shorter.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= longer.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= shorter.length; i++) {
          for (let j = 1; j <= longer.length; j++) {
            const cost = longer[j - 1] === shorter[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost
            );
          }
        }

        const distance = matrix[shorter.length][longer.length];
        const similarity = (longerLength - distance) / longerLength;
        return similarity >= 0.8;
      })();

      console.log("chữ đáp án để so sánh:", target);
      console.log("chữ gửi từ màn con lên:", input);
      console.log("Kết quả so sánh:", isCorrect ? "Đúng ✅" : "Sai ❌");

      if (isCorrect) {
        playCorrectSound(require("../sound/soundCorect.mp3"));
        setIsCorrectAnswer(true);
        setIsAnswerChecked(true);
        if (isRetryingIncorrect) {
          setScore((prev) => prev + onePoint / 2);
          setCorrectAnswerCount((x) => x + 1);
          setIncorrectAnswerCount((x) => x - 1);
        } else {
          setScore((prev) => prev + onePoint);
          setCorrectAnswerCount((x) => x + 1);
        }
      } else {
        setIsCorrectAnswer(false);
        setIsAnswerChecked(true);
        setSelectedAnswer(null);
        setQuestionIncorrect((prev) => [...prev, currentQuestion]);
        if (!isRetryingIncorrect) {
          setIncorrectAnswerCount((x) => x + 1);
        }
      }
    }
    //check câu phát âm
    if (currentQuestion.questionType === QuestionType.PRONUNCIATION) {
      console.log("Từ gửi lên từ con:", selectedWords);
      console.log("Từ để so sánh:", currentQuestion.targetWordNative);

      const target = currentQuestion.targetWordNative;
      const input = selectedWords[0] || "";

      // So sánh chữ giống ≥ 70%
      const isCorrect = (() => {
        if (!target || !input) return false;

        const longer = target.length > input.length ? target : input;
        const shorter = target.length > input.length ? input : target;
        const longerLength = longer.length;

        const matrix: number[][] = Array.from(
          { length: shorter.length + 1 },
          (_, i) => Array(longer.length + 1).fill(0)
        );
        for (let i = 0; i <= shorter.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= longer.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= shorter.length; i++) {
          for (let j = 1; j <= longer.length; j++) {
            const cost = longer[j - 1] === shorter[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost
            );
          }
        }

        const distance = matrix[shorter.length][longer.length];
        const similarity = (longerLength - distance) / longerLength;

        return similarity >= 0.7; // <-- chỉ khác ở đây
      })();

      console.log("Chữ đáp án để so sánh:", target);
      console.log("Chữ gửi từ màn con lên:", input);
      console.log("Kết quả so sánh:", isCorrect ? "Đúng ✅" : "Sai ❌");
      if (isCorrect) {
        playCorrectSound(require("../sound/soundCorect.mp3"));
        setIsCorrectAnswer(true);
        setIsAnswerChecked(true);
        if (isRetryingIncorrect) {
          setScore((prev) => prev + onePoint / 2);
          setCorrectAnswerCount((x) => x + 1);
          setIncorrectAnswerCount((x) => x - 1);
        } else {
          setScore((prev) => prev + onePoint);
          setCorrectAnswerCount((x) => x + 1);
        }
      } else {
        setIsCorrectAnswer(false);
        setIsAnswerChecked(true);
        setSelectedAnswer(null);
        setQuestionIncorrect((prev) => [...prev, currentQuestion]);
        if (!isRetryingIncorrect) {
          setIncorrectAnswerCount((x) => x + 1);
        }
      }
    }
    //tìm choice đúng để luuw vào thong báo ket qua
    const findCorrectAnswerChoice = () => {
      // Trả về null nếu không có choices
      if (!currentQuestion.choices || currentQuestion.choices.length === 0) {
        return null;
      }

      // Trường hợp chỉ có 1 lựa chọn
      if (currentQuestion.choices.length === 1) {
        return currentQuestion.choices[0];
      }

      // Trường hợp có nhiều lựa chọn, tìm cái đúng
      // `.find()` có thể trả về `undefined` nên chúng ta phải xử lý
      const foundChoice = currentQuestion.choices.find(
        (choice) => choice.isCorrect
      );

      // Nếu tìm thấy thì trả về đối tượng, ngược lại trả về null
      return foundChoice ?? null;
    };

    const correctChoice = findCorrectAnswerChoice();
    setCorrectAnswerText(correctChoice); // Dòng này giờ đã không còn lỗi nữa!
    // if (isAnswerCorrect) {
    //   setCorrectAnswerCount((x) => x + 1);
    // } else {
    //   setIncorrectAnswerCount((x) => x + 1);
    // }

    // Cập nhật kết quả câu hỏi dựa trên cấu trúc dữ liệu mới
    //   setQuestionResults((questionResults) => [
    //     ...questionResults,
    //     {
    //       question: currentQuestion.promptTextTemplate,
    //       yourResponse:
    //         currentQuestion.questionType === "WORD_ORDER"
    //           ? selectedAnswers.map((answer) => answer.textForeign).join(" ")
    //           : selectedAnswer?.meaning, // Hoặc một trường khác phù hợp
    //       correctResponse:
    //         currentQuestion.questionType === "WORD_ORDER"
    //           ? // Logic cho câu hỏi sắp xếp từ cần được tùy chỉnh
    //             correctAnswer
    //           : correctAnswer?.meaning, // Hoặc một trường khác phù hợp
    //     },
    //   ]);
  };

  const unitNumber = Number(route.params["fast-forward"]);

  // if (hearts !== null && hearts < 0 && !correctAnswerShown) {
  //   return (
  //     <LessonFastForwardEndFail
  //       unitNumber={unitNumber}
  //       reviewLessonShown={reviewLessonShown}
  //       setReviewLessonShown={setReviewLessonShown}
  //       questionResults={questionResults}
  //       navigation={navigation}
  //     />
  //   );
  // }

  // if (
  //   hearts !== null &&
  //   hearts >= 0 &&
  //   !correctAnswerShown &&
  //   correctAnswerCount >= totalCorrectAnswersNeeded
  // ) {
  //   return (
  //     <LessonFastForwardEndPass
  //       unitNumber={unitNumber}
  //       reviewLessonShown={reviewLessonShown}
  //       setReviewLessonShown={setReviewLessonShown}
  //       questionResults={questionResults}
  //       navigation={navigation}
  //     />
  //   );
  // }

  // if (hearts !== null && isStartingLesson) {
  //   return (
  //     <LessonFastForwardStart
  //       unitNumber={unitNumber}
  //       setIsStartingLesson={setIsStartingLesson}
  //       navigation={navigation}
  //     />
  //   );
  // }

  // if (correctAnswerCount >= totalCorrectAnswersNeeded && !correctAnswerShown) {
  //   return (
  //     <LessonComplete
  //       correctAnswerCount={correctAnswerCount}
  //       incorrectAnswerCount={incorrectAnswerCount}
  //       startTime={startTime}
  //       endTime={endTime}
  //       reviewLessonShown={reviewLessonShown}
  //       setReviewLessonShown={setReviewLessonShown}
  //       questionResults={questionResults}
  //       navigation={navigation}
  //     />
  //   );
  // }

  switch (currentQuestion.questionType) {
    case QuestionType.MULTIPLE_CHOICE_VOCAB_IMAGE: {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              originalQuestionsLength={originalQuestionsLength}
              questionIncorrectLength={questionIncorrect.length}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
              isRetryingIncorrect={isRetryingIncorrect} // Thêm dòng này
            />
          </View>
          <View
            style={{ flex: 1 }}
            pointerEvents={isAnswerChecked ? "none" : "auto"}
          >
            <SelectImage
              question={currentQuestion}
              onCheckAnswer={onCheckAnswer}
              onNextQuestion={onSkip}
              hearts={hearts}
              onSelectAnswer={setSelectedAnswer}
            />
          </View>

          <View>
            {isAnswerChecked && (
              <CheckAnswer
                correctAnswer={correctAnswerText}
                correctAnswerShown={isAnswerChecked}
                isAnswerCorrect={isCorrectAnswer}
                questionType={currentQuestion.questionType}
                onFinish={onSkip}
                onCheckAnswer={onCheckAnswer}
                onSkip={onSkip}
              />
            )}
          </View>
        </View>
      );
    }

    case QuestionType.MULTIPLE_CHOICE_TEXT_ONLY: {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              originalQuestionsLength={originalQuestionsLength}
              questionIncorrectLength={questionIncorrect.length}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
              isRetryingIncorrect={isRetryingIncorrect} // Thêm dòng này
            />
          </View>
          <View
            style={{ flex: 1 }}
            pointerEvents={isAnswerChecked ? "none" : "auto"}
          >
            <SelectText
              question={currentQuestion}
              onCheckAnswer={onCheckAnswer}
              onNextQuestion={onSkip}
              onSelectAnswer={setSelectedAnswer}
              hearts={hearts}
              // Thêm các props khác nếu cần
            />
          </View>
          <View>
            {isAnswerChecked && (
              <CheckAnswer
                correctAnswer={correctAnswerText}
                correctAnswerShown={isAnswerChecked}
                isAnswerCorrect={isCorrectAnswer}
                questionType={currentQuestion.questionType}
                onFinish={onSkip}
                onCheckAnswer={onCheckAnswer}
                onSkip={onSkip}
              />
            )}
          </View>
        </View>
      );
    }

    case QuestionType.AUDIO_CHOICE: {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              originalQuestionsLength={originalQuestionsLength}
              questionIncorrectLength={questionIncorrect.length}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
              isRetryingIncorrect={isRetryingIncorrect} // Thêm dòng này
            />
          </View>
          <View
            style={{ flex: 1 }}
            pointerEvents={isAnswerChecked ? "none" : "auto"}
          >
            <AudioChoice
              question={currentQuestion}
              onCheckAnswer={onCheckAnswer}
              onNextQuestion={onSkip}
              onSelectAnswer={setSelectedAnswer}
              hearts={hearts}
              // Thêm các props khác nếu cần
            />
          </View>
          <View>
            {isAnswerChecked && (
              <CheckAnswer
                correctAnswer={correctAnswerText}
                correctAnswerShown={isAnswerChecked}
                isAnswerCorrect={isCorrectAnswer}
                questionType={currentQuestion.questionType}
                onFinish={onSkip}
                onCheckAnswer={onCheckAnswer}
                onSkip={onSkip}
              />
            )}
          </View>
        </View>
      );
    }

    case QuestionType.WORD_ORDER: {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              originalQuestionsLength={originalQuestionsLength}
              questionIncorrectLength={questionIncorrect.length}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
              isRetryingIncorrect={isRetryingIncorrect} // Thêm dòng này
            />
          </View>
          <View
            style={{ flex: 1 }}
            pointerEvents={isAnswerChecked ? "none" : "auto"}
          >
            <WordOrder
              question={currentQuestion}
              onCheckAnswer={onCheckAnswer}
              onNextQuestion={onSkip}
              onSelectedWords={setSelectedWords}
              hearts={hearts}
              // Thêm các props khác nếu cần
            />
          </View>
          <View>
            {isAnswerChecked && (
              <CheckAnswer
                correctAnswer={correctAnswerText}
                correctAnswerShown={isAnswerChecked}
                isAnswerCorrect={isCorrectAnswer}
                questionType={currentQuestion.questionType}
                onFinish={onSkip}
                onCheckAnswer={onCheckAnswer}
                onSkip={onSkip}
              />
            )}
          </View>
        </View>
      );
    }

    case QuestionType.PRONUNCIATION: {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              originalQuestionsLength={originalQuestionsLength}
              questionIncorrectLength={questionIncorrect.length}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
              isRetryingIncorrect={isRetryingIncorrect} // Thêm dòng này
            />
          </View>
          <View
            style={{ flex: 1 }}
            pointerEvents={isAnswerChecked ? "none" : "auto"}
          >
            <Pronunciation
              question={currentQuestion}
              onCheckAnswer={onCheckAnswer}
              onNextQuestion={onSkip}
              onSelectedWords={setSelectedWords}
              // hearts={hearts}
              // Thêm các props khác nếu cần
            />
          </View>
          <View>
            {isAnswerChecked && (
              <CheckAnswer
                correctAnswer={selectedAnswer?.textForeign || ""}
                correctAnswerShown={isAnswerChecked}
                isAnswerCorrect={isCorrectAnswer}
                questionType={currentQuestion.questionType}
                onFinish={onSkip}
                onCheckAnswer={onCheckAnswer}
                onSkip={onSkip}
              />
            )}
          </View>
        </View>
      );
    }

    case QuestionType.WRITING: {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              originalQuestionsLength={originalQuestionsLength}
              questionIncorrectLength={questionIncorrect.length}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
              isRetryingIncorrect={isRetryingIncorrect} // Thêm dòng này
            />
          </View>
          <View
            style={{ flex: 1 }}
            pointerEvents={isAnswerChecked ? "none" : "auto"}
          >
            <Writing
              question={currentQuestion}
              onCheckAnswer={onCheckAnswer}
              onNextQuestion={onSkip}
              onSelectedWords={setSelectedWords}
              hearts={hearts}
              // Thêm các props khác nếu cần
            />
          </View>
          <View>
            {isAnswerChecked && (
              <CheckAnswer
                correctAnswer={selectedAnswer?.textForeign || ""}
                correctAnswerShown={isAnswerChecked}
                isAnswerCorrect={isCorrectAnswer}
                questionType={currentQuestion.questionType}
                onFinish={onSkip}
                onCheckAnswer={onCheckAnswer}
                onSkip={onSkip}
              />
            )}
          </View>
        </View>
      );
    }

    default:
      return <Text>Loại câu hỏi không được hỗ trợ!</Text>;
  }
};

// =========================================================================
//                                SUB-COMPONENTS
// =========================================================================

const ProgressBar = ({
  correctAnswerCount,
  originalQuestionsLength,
  setQuitMessageShown,
  hearts,
  navigation,
}: {
  correctAnswerCount: number;
  originalQuestionsLength: number;
  questionIncorrectLength: number; // Prop này không được sử dụng nữa nhưng có thể giữ lại để không gây lỗi
  setQuitMessageShown: (isShown: boolean) => void;
  hearts: null | number;
  navigation: LessonScreenNavigationProp;
  isRetryingIncorrect: boolean; // Prop này cũng không cần thiết cho logic mới
}) => {
  // Tính toán tiến độ dựa trên số câu trả lời đúng và tổng số câu ban đầu
  const progress = correctAnswerCount / originalQuestionsLength;

  return (
    <View style={styles.progressBarHeader}>
      <TouchableOpacity
        onPress={() => navigation.navigate("LearningPathScreen")}
        style={styles.closeButton}
      >
        <CloseSvg />
      </TouchableOpacity>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(progress, 1) * 100}%` },
            ]}
          />
        </View>
      </View>
      {hearts !== null &&
        [1, 2, 3].map((heart) => {
          if (heart <= hearts) {
            return <LessonTopBarHeart key={heart} />;
          }
          return <LessonTopBarEmptyHeart key={heart} />;
        })}
    </View>
  );
};
const QuitMessage = ({
  quitMessageShown,
  setQuitMessageShown,
  navigation,
}: {
  quitMessageShown: boolean;
  setQuitMessageShown: (isShown: boolean) => void;
  navigation: LessonScreenNavigationProp;
}) => {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.quitOverlay,
          quitMessageShown
            ? styles.quitOverlayVisible
            : styles.quitOverlayHidden,
        ]}
        onPress={() => setQuitMessageShown(false)}
      />

      <View
        style={[
          styles.quitArticle,
          quitMessageShown
            ? styles.quitArticleVisible
            : styles.quitArticleHidden,
        ]}
      >
        <View style={styles.quitContent}>
          <Text style={styles.quitHeader}>Are you sure you want to quit?</Text>
          <Text style={styles.quitText}>
            All progress for this lesson will be lost.
          </Text>
        </View>
        <View style={styles.quitButtonContainer}>
          <TouchableOpacity
            style={styles.quitQuitButton}
            onPress={() => navigation.navigate("LearningPathScreen")}
          >
            <Text style={styles.quitQuitButtonText}>Quit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quitStayButton}
            onPress={() => setQuitMessageShown(false)}
          >
            <Text style={styles.quitStayButtonText}>Stay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const CheckAnswer = ({
  isAnswerCorrect,
  correctAnswerShown,
  correctAnswer,
  questionType,
  onCheckAnswer, // Thêm prop này vào đây
  onFinish,
  onSkip,
}: {
  isAnswerCorrect: boolean;
  correctAnswerShown: boolean;
  correctAnswer: Choice | string | null;
  questionType: QuestionType;
  onCheckAnswer: () => void; // Khai báo type
  onFinish: () => void;
  onSkip: () => void;
}) => {
  return (
    <>
      <View
        style={[
          styles.correctAnswerContainer,
          correctAnswerShown
            ? isAnswerCorrect
              ? styles.correctAnswerShownCorrect
              : styles.correctAnswerShownIncorrect
            : styles.correctAnswerHidden,
        ]}
      >
        <View style={styles.correctAnswerContent}>
          {isAnswerCorrect ? (
            <>
              {questionType === QuestionType.PRONUNCIATION ||
              questionType === QuestionType.WRITING ? (
                // Nếu là câu Viết hoặc Nói và đúng, chỉ hiện "Good job!"
                <View style={styles.correctAnswerMessage}>
                  <View style={styles.doneIconContainer}>
                    <DoneSvg />
                  </View>
                  <Text style={styles.correctAnswerText}>Good job!</Text>
                </View>
              ) : (
                // Nếu là các câu khác và đúng, chỉ hiện giải pháp
                <View style={styles.correctAnswerMessage}>
                  <View style={styles.doneIconContainer}>
                    <DoneSvg />
                  </View>
                  <View style={styles.correctAnswerSolution}>
                    <Text style={styles.correctAnswerText}>Good job!</Text>
                    <Text style={styles.correctAnswerSolutionText}>
                      {typeof correctAnswer === "object" &&
                      correctAnswer !== null
                        ? `${correctAnswer.textForeign}\n(${correctAnswer.textRomaji})\n${correctAnswer.meaning}`
                        : correctAnswer}
                    </Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            // Kết thúc logic khi trả lời đúng
            <View style={styles.correctAnswerMessage}>
              {questionType === QuestionType.PRONUNCIATION ||
              questionType === QuestionType.WRITING ? (
                <>
                  {/* Nếu là câu Viết hoặc Nói, chỉ hiện thông báo Incorrect */}
                  <View style={styles.closeIconContainer}>
                    <BigCloseSvg />
                  </View>
                  <Text style={styles.correctAnswerText}>Incorrect</Text>
                </>
              ) : (
                <>
                  {/* Nếu là các loại câu hỏi khác, chỉ hiện đáp án đúng */}
                  <View style={styles.closeIconContainer}>
                    <BigCloseSvg />
                  </View>
                  <View style={styles.correctAnswerSolution}>
                    <Text style={styles.correctAnswerText}>
                      Correct solution:
                    </Text>
                    <Text style={styles.correctAnswerSolutionText}>
                      {typeof correctAnswer === "object" &&
                      correctAnswer !== null
                        ? `${correctAnswer.textForeign}\n(${correctAnswer.textRomaji})\n${correctAnswer.meaning}`
                        : correctAnswer}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
          <TouchableOpacity
            onPress={onFinish}
            style={[
              styles.continueButton,
              isAnswerCorrect
                ? styles.continueButtonCorrect
                : styles.continueButtonIncorrect,
            ]}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const LessonComplete = ({
  correctAnswerCount,
  incorrectAnswerCount,
  startTime,
  endTime,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
  navigation,
}: {
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  startTime: React.MutableRefObject<number>;
  endTime: React.RefObject<number>;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
  navigation: LessonScreenNavigationProp;
}) => {
  const route = useRoute();
  // const isPractice = "practice" in route.params;

  const increaseXp = useBoundStore((x) => x.increaseXp);
  const addToday = useBoundStore((x) => x.addToday);
  const increaseLingots = useBoundStore((x) => x.increaseLingots);
  const increaseLessonsCompleted = useBoundStore(
    (x) => x.increaseLessonsCompleted
  );

  // const onContinue = () => {
  //   increaseXp(correctAnswerCount);
  //   addToday();
  //   increaseLingots(isPractice ? 0 : 1);
  //   if (!isPractice) {
  //     increaseLessonsCompleted();
  //   }
  //   navigation.navigate("LearningPathScreen");
  // };

  return (
    <SafeAreaView style={styles.lessonCompleteContainer}>
      <View style={styles.lessonCompleteContent}>
        <View style={styles.lessonCompleteHeaderContainer}>
          <Text style={styles.lessonCompleteHeaderText}>Lesson Complete!</Text>
          <View style={styles.lessonCompleteStatsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Total XP</Text>
              <View style={styles.statValueBox}>
                <Text style={styles.statValueText}>{correctAnswerCount}</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Committed</Text>
              <View style={styles.statValueBox}>
                <Text style={styles.statValueText}>
                  {formatTime(
                    (endTime.current || Date.now()) - startTime.current
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statTitle}>Amazing</Text>
              <View style={styles.statValueBox}>
                <Text style={styles.statValueText}>
                  {Math.round(
                    (correctAnswerCount /
                      (correctAnswerCount + incorrectAnswerCount)) *
                      100
                  )}
                  %
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.lessonCompleteFooter}>
          <TouchableOpacity
            style={styles.reviewLessonButton}
            onPress={() => setReviewLessonShown(true)}
          >
            <Text style={styles.reviewLessonButtonText}>Review lesson</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reviewLessonButton}
            // onPress={onContinue}
          >
            <Text style={styles.reviewLessonButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </SafeAreaView>
  );
};

const ReviewLesson = ({
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  const [selectedQuestionResult, setSelectedQuestionResult] =
    useState<null | QuestionResult>(null);

  return (
    <View
      style={[
        styles.reviewLessonOverlay,
        reviewLessonShown
          ? styles.reviewLessonOverlayVisible
          : styles.reviewLessonOverlayHidden,
      ]}
    >
      <TouchableOpacity
        style={styles.reviewLessonBackground}
        onPress={() => setReviewLessonShown(false)}
      />
      <View style={styles.reviewLessonContainer}>
        <TouchableOpacity
          style={styles.closeReviewButton}
          onPress={() => setReviewLessonShown(false)}
        >
          <BigCloseSvg style={styles.closeReviewIcon} />
        </TouchableOpacity>
        <Text style={styles.reviewLessonHeader}>Check out your scorecard!</Text>
        <Text style={styles.reviewLessonSubHeader}>
          Click the tiles below to reveal the solutions
        </Text>
        <ScrollView contentContainerStyle={styles.reviewLessonGrid}>
          {questionResults.map((questionResult, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.reviewLessonTile,
                questionResult.yourResponse === questionResult.correctResponse
                  ? styles.reviewLessonTileCorrect
                  : styles.reviewLessonTileIncorrect,
              ]}
              onPress={() =>
                setSelectedQuestionResult((selected) =>
                  selected === questionResult ? null : questionResult
                )
              }
            >
              <View style={styles.reviewLessonTileHeader}>
                <Text style={styles.reviewLessonTileTitle}>
                  {questionResult.question}
                </Text>
                <View style={styles.reviewLessonTileIconContainer}>
                  {questionResult.yourResponse ===
                  questionResult.correctResponse ? (
                    <DoneSvg style={styles.reviewLessonTileIcon} />
                  ) : (
                    <BigCloseSvg style={styles.reviewLessonTileIcon} />
                  )}
                </View>
              </View>
              <Text>{questionResult.yourResponse}</Text>
              {selectedQuestionResult === questionResult && (
                <View style={styles.reviewLessonTooltip}>
                  <View style={styles.reviewLessonTooltipArrow} />
                  <Text style={styles.tooltipHeader}>Your response:</Text>
                  <Text style={styles.tooltipText}>
                    {questionResult.yourResponse}
                  </Text>
                  <Text style={styles.tooltipHeader}>Correct response:</Text>
                  <Text style={styles.tooltipText}>
                    {questionResult.correctResponse}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const LessonFastForwardStart = ({
  unitNumber,
  setIsStartingLesson,
  navigation,
}: {
  unitNumber: number;
  setIsStartingLesson: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: LessonScreenNavigationProp;
}) => {
  return (
    <SafeAreaView style={styles.fastForwardContainer}>
      <View style={styles.fastForwardContent}>
        <LessonFastForwardStartSvg />
        <Text style={styles.fastForwardHeader}>
          Want to jump to Unit {unitNumber}?
        </Text>
        <Text style={styles.fastForwardText}>
          Pass the test to jump ahead. We won't make it easy for you though.
        </Text>
      </View>
      <View style={styles.fastForwardFooter}>
        <TouchableOpacity
          onPress={() => navigation.navigate("LearningPathScreen")}
          style={styles.fastForwardLaterButton}
        >
          <Text style={styles.fastForwardLaterButtonText}>Maybe later</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsStartingLesson(false)}
          style={styles.fastForwardGoButton}
        >
          <Text style={styles.fastForwardGoButtonText}>Let's go</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const LessonFastForwardEndFail = ({
  unitNumber,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
  navigation,
}: {
  unitNumber: number;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
  navigation: LessonScreenNavigationProp;
}) => {
  return (
    <SafeAreaView style={styles.fastForwardContainer}>
      <View style={styles.fastForwardContent}>
        <LessonFastForwardEndFailSvg />
        <Text style={styles.fastForwardHeader}>
          {`You didn't unlock Unit ${unitNumber}`}
        </Text>
        <Text style={styles.fastForwardText}>
          Don't worry! Practice makes perfect.
        </Text>
      </View>
      <View style={styles.fastForwardFooter}>
        <TouchableOpacity
          style={styles.reviewLessonButton}
          onPress={() => setReviewLessonShown(true)}
        >
          <Text style={styles.reviewLessonButtonText}>Review lesson</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("LearningPathScreen")}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </SafeAreaView>
  );
};

const LessonFastForwardEndPass = ({
  unitNumber,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
  navigation,
}: {
  unitNumber: number;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
  navigation: LessonScreenNavigationProp;
}) => {
  const increaseXp = useBoundStore((x) => x.increaseXp);
  const addToday = useBoundStore((x) => x.addToday);
  const increaseLingots = useBoundStore((x) => x.increaseLingots);
  const onContinue = () => {
    increaseXp(50); // Giả định XP cho Fast Forward
    addToday();
    increaseLingots(5); // Giả định lingots cho Fast Forward
    navigation.navigate("LearningPathScreen");
  };

  return (
    <SafeAreaView style={styles.fastForwardContainer}>
      <View style={styles.fastForwardContent}>
        <LessonFastForwardEndPassSvg />
        <Text style={styles.fastForwardHeader}>
          {`You unlocked Unit ${unitNumber}!`}
        </Text>
        <Text style={styles.fastForwardText}>
          You are ready to learn a new language.
        </Text>
      </View>
      <View style={styles.fastForwardFooter}>
        <TouchableOpacity
          style={styles.reviewLessonButton}
          onPress={() => setReviewLessonShown(true)}
        >
          <Text style={styles.reviewLessonButtonText}>Review lesson</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </SafeAreaView>
  );
};

// =========================================================================
//                                STYLESHEET
// =========================================================================

const styles = StyleSheet.create({
  // Main Lesson screen
  problemContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  problemScrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  problemContent: {
    flexGrow: 1,
    gap: 20,
  },
  progressBarWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    height: 100, // Tăng chiều cao để chứa paddingTop 50
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  questionSection: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  answerTile: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    minHeight: 100,
  },
  answerTileSelected: {
    borderColor: "#60a5fa",
    backgroundColor: "#eff6ff",
  },
  answerText: {
    fontSize: 16,
    textAlign: "center",
  },

  // ProgressBar
  progressBarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  closeButton: {
    padding: 8,
  },
  progressBarContainer: {
    height: 16,
    flexGrow: 1,
    borderRadius: 9999,
    backgroundColor: "#e5e7eb",
  },

  progressBarBackground: {
    width: "100%", // chắc chắn container fill không vượt
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden", // cắt overflow
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    overflow: "hidden",
  },
  progressBarInnerFill: {
    height: 5,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#4ade80",
  },

  // QuitMessage
  quitOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
  },
  quitOverlayVisible: { opacity: 0.6 },
  quitOverlayHidden: { opacity: 0, zIndex: -1 },
  quitArticle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: "column",
  },
  quitArticleVisible: { transform: [{ translateY: 0 }] },
  quitArticleHidden: { transform: [{ translateY: 500 }] },
  quitContent: {
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  quitHeader: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  quitText: { color: "#6b7280", textAlign: "center" },
  quitButtonContainer: {
    flexDirection: "row-reverse",
    gap: 16,
    justifyContent: "center",
  },
  quitQuitButton: {
    backgroundColor: "#60a5fa",
    padding: 12,
    borderRadius: 12,
    minWidth: 150,
  },
  quitQuitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  quitStayButton: {
    padding: 12,
    borderRadius: 12,
    minWidth: 150,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  quitStayButtonText: {
    color: "#6b7280",
    fontWeight: "bold",
    textAlign: "center",
  },

  // CheckAnswer
  checkAnswerSection: {
    borderTopWidth: 2,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  checkAnswerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    padding: 12,
    minWidth: 120,
  },
  skipButtonText: { color: "#9ca3af", fontWeight: "bold" },
  checkButtonDisabled: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  checkButtonEnabled: {
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  checkButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  correctAnswerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  correctAnswerShownCorrect: {
    backgroundColor: "#dcfce7",
  },
  correctAnswerShownIncorrect: {
    backgroundColor: "#fee2e2",
  },
  correctAnswerHidden: {
    bottom: -200,
  },
  correctAnswerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  correctAnswerMessage: { flexDirection: "row", gap: 16, alignItems: "center" },
  doneIconContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 9999,
  },
  closeIconContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 9999,
  },
  correctAnswerText: { fontSize: 20, fontWeight: "bold" },
  correctAnswerSolution: { gap: 8 },
  correctAnswerSolutionText: { fontSize: 14, fontWeight: "normal" },
  continueButton: {
    padding: 12,
    borderRadius: 12,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  continueButtonCorrect: { backgroundColor: "#22c55e" },
  continueButtonIncorrect: { backgroundColor: "#ef4444" },

  // ProblemWriteInEnglish
  writeQuestionText: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  writeInputContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  imageBubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  image: { width: 92, height: 115 },
  speechBubble: {
    position: "relative",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  speechBubbleArrow: {
    position: "absolute",
    top: "50%",
    left: -10,
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "#e5e7eb",
  },
  selectedAnswersContainer: {
    minHeight: 60,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
    paddingVertical: 4,
    marginTop: 8,
  },
  selectedAnswerTile: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  answerTilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
  },
  answerTileButton: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  answerTileButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  answerTileText: {
    color: "#4b5563",
  },
  answerTileTextDisabled: {
    color: "#e5e7eb",
  },

  // LessonComplete
  lessonCompleteContainer: { flex: 1, backgroundColor: "#fff" },
  lessonCompleteContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  lessonCompleteHeaderContainer: {
    alignItems: "center",
    gap: 20,
  },
  lessonCompleteHeaderText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#facc15",
  },
  lessonCompleteStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  statBox: {
    minWidth: 110,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#facc15",
    backgroundColor: "#facc15",
  },
  statTitle: {
    paddingVertical: 4,
    textAlign: "center",
    color: "#fff",
  },
  statValueBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
  },
  statValueText: {
    color: "#facc15",
    fontWeight: "bold",
  },
  lessonCompleteFooter: {
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewLessonButton: {
    padding: 12,
    minWidth: 150,
  },
  reviewLessonButtonText: {
    color: "#6b7280",
    fontWeight: "bold",
    textAlign: "center",
  },

  // ReviewLesson
  reviewLessonOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  reviewLessonOverlayVisible: { opacity: 1, zIndex: 10 },
  reviewLessonOverlayHidden: { opacity: 0, zIndex: -1 },
  reviewLessonBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    opacity: 0.75,
  },
  reviewLessonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  closeReviewButton: {
    position: "absolute",
    top: -20,
    right: -20,
    padding: 4,
    borderRadius: 9999,
    backgroundColor: "#e5e7eb",
  },
  closeReviewIcon: {
    width: 32,
    height: 32,
  },
  reviewLessonHeader: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  reviewLessonSubHeader: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  reviewLessonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  reviewLessonTile: {
    position: "relative",
    flex: 1,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  reviewLessonTileCorrect: { backgroundColor: "#fff9e6" },
  reviewLessonTileIncorrect: { backgroundColor: "#ffebeb" },
  reviewLessonTileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  reviewLessonTileTitle: { fontWeight: "bold" },
  reviewLessonTileIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewLessonTileIcon: { width: 20, height: 20 },
  reviewLessonTooltip: {
    position: "absolute",
    top: 80,
    left: 4,
    right: 4,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    zIndex: 1,
  },
  reviewLessonTooltipArrow: {
    position: "absolute",
    top: -10,
    left: "50%",
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "#e5e7eb",
  },
  tooltipHeader: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  tooltipText: {
    color: "#4b5563",
    marginBottom: 12,
  },

  // FastForward screens
  fastForwardContainer: { flex: 1, padding: 20, backgroundColor: "#fff" },
  fastForwardContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  fastForwardHeader: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  fastForwardText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  fastForwardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: "#e5e7eb",
    paddingVertical: 16,
  },
  fastForwardLaterButton: {
    padding: 12,
  },
  fastForwardLaterButtonText: {
    color: "#60a5fa",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  fastForwardGoButton: {
    backgroundColor: "#60a5fa",
    padding: 12,
    borderRadius: 12,
    minWidth: 150,
  },
  fastForwardGoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default Lesson;
