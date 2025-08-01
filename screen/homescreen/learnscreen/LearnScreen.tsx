import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
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

// Định nghĩa kiểu cho navigation và route
type LessonScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "LessonScreen"
>["navigation"];
type LessonScreenRouteProp = any;

// Dữ liệu câu hỏi giả định
const lessonProblem1 = {
  type: "SELECT_1_OF_3",
  question: `Which one of these is "the apple"?`,
  answers: [
    { icon: <BoySvg />, name: "el niño" },
    { icon: <WomanSvg />, name: "la mujer" },
  ],
  correctAnswer: 0,
} as const;

const lessonProblem2 = {
  type: "WRITE_IN_ENGLISH",
  question: "El niño",
  answerTiles: ["woman", "milk", "water", "I", "The", "boy"],
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

// =========================================================================
//                                MAIN COMPONENT
// =========================================================================

const Lesson = () => {
  const navigation = useNavigation<LessonScreenNavigationProp>();
  const route = useRoute<LessonScreenRouteProp>();

  const [lessonProblem, setLessonProblem] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<null | number>(null);
  const [correctAnswerShown, setCorrectAnswerShown] = useState(false);
  const [quitMessageShown, setQuitMessageShown] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const startTime = useRef(Date.now());
  const endTime = useRef(startTime.current + 1000 * 60 * 3 + 1000 * 33);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);
  const [isStartingLesson, setIsStartingLesson] = useState(true);

  const problem = lessonProblems[lessonProblem] ?? lessonProblem1;
  const totalCorrectAnswersNeeded = 2;

  const hearts =
    "fast-forward" in route.params &&
    !isNaN(Number(route.params["fast-forward"]))
      ? 3 - incorrectAnswerCount
      : null;

  const { correctAnswer } = problem;
  const isAnswerCorrect = Array.isArray(correctAnswer)
    ? numbersEqual(selectedAnswers, correctAnswer)
    : selectedAnswer === correctAnswer;

  const onCheckAnswer = () => {
    setCorrectAnswerShown(true);
    if (isAnswerCorrect) {
      setCorrectAnswerCount((x) => x + 1);
    } else {
      setIncorrectAnswerCount((x) => x + 1);
    }
    setQuestionResults((questionResults) => [
      ...questionResults,
      {
        question: problem.question,
        yourResponse:
          problem.type === "SELECT_1_OF_3"
            ? problem.answers[selectedAnswer ?? 0]?.name ?? ""
            : selectedAnswers.map((i) => problem.answerTiles[i]).join(" "),
        correctResponse:
          problem.type === "SELECT_1_OF_3"
            ? problem.answers[problem.correctAnswer].name
            : problem.correctAnswer
                .map((i) => problem.answerTiles[i])
                .join(" "),
      },
    ]);
  };

  const onFinish = () => {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setCorrectAnswerShown(false);
    setLessonProblem((x) => (x + 1) % lessonProblems.length);
    endTime.current = Date.now();
  };

  const onSkip = () => {
    setSelectedAnswer(null);
    setCorrectAnswerShown(true);
  };

  const unitNumber = Number(route.params["fast-forward"]);

  if (hearts !== null && hearts < 0 && !correctAnswerShown) {
    return (
      <LessonFastForwardEndFail
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
        navigation={navigation}
      />
    );
  }

  if (
    hearts !== null &&
    hearts >= 0 &&
    !correctAnswerShown &&
    correctAnswerCount >= totalCorrectAnswersNeeded
  ) {
    return (
      <LessonFastForwardEndPass
        unitNumber={unitNumber}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
        navigation={navigation}
      />
    );
  }

  if (hearts !== null && isStartingLesson) {
    return (
      <LessonFastForwardStart
        unitNumber={unitNumber}
        setIsStartingLesson={setIsStartingLesson}
        navigation={navigation}
      />
    );
  }

  if (correctAnswerCount >= totalCorrectAnswersNeeded && !correctAnswerShown) {
    return (
      <LessonComplete
        correctAnswerCount={correctAnswerCount}
        incorrectAnswerCount={incorrectAnswerCount}
        startTime={startTime}
        endTime={endTime}
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
        navigation={navigation}
      />
    );
  }

  switch (problem.type) {
    case "SELECT_1_OF_3": {
      return (
        <ProblemSelect1Of3
          problem={problem}
          correctAnswerCount={correctAnswerCount}
          totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          quitMessageShown={quitMessageShown}
          correctAnswerShown={correctAnswerShown}
          setQuitMessageShown={setQuitMessageShown}
          isAnswerCorrect={isAnswerCorrect}
          onCheckAnswer={onCheckAnswer}
          onFinish={onFinish}
          onSkip={onSkip}
          hearts={hearts}
          navigation={navigation}
        />
      );
    }

    case "WRITE_IN_ENGLISH": {
      return (
        <ProblemWriteInEnglish
          problem={problem}
          correctAnswerCount={correctAnswerCount}
          totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
          selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
          quitMessageShown={quitMessageShown}
          correctAnswerShown={correctAnswerShown}
          setQuitMessageShown={setQuitMessageShown}
          isAnswerCorrect={isAnswerCorrect}
          onCheckAnswer={onCheckAnswer}
          onFinish={onFinish}
          onSkip={onSkip}
          hearts={hearts}
          navigation={navigation}
        />
      );
    }
    default:
      return null;
  }
};

// =========================================================================
//                                SUB-COMPONENTS
// =========================================================================

const ProgressBar = ({
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  setQuitMessageShown,
  hearts,
  navigation,
}: {
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  setQuitMessageShown: (isShown: boolean) => void;
  hearts: null | number;
  navigation: LessonScreenNavigationProp;
}) => {
  const progress = correctAnswerCount / totalCorrectAnswersNeeded;
  return (
    <View style={styles.progressBarHeader}>
      {correctAnswerCount === 0 ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("LearningPathScreen")}
          style={styles.closeButton}
        >
          <CloseSvg />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setQuitMessageShown(true)}
        >
          <CloseSvg />
        </TouchableOpacity>
      )}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]}>
          <View style={styles.progressBarInnerFill} />
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
  isAnswerSelected,
  isAnswerCorrect,
  correctAnswerShown,
  correctAnswer,
  onCheckAnswer,
  onFinish,
  onSkip,
}: {
  isAnswerSelected: boolean;
  isAnswerCorrect: boolean;
  correctAnswerShown: boolean;
  correctAnswer: string;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
}) => {
  return (
    <>
      <View style={styles.checkAnswerSection}>
        <View style={styles.checkAnswerContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          {!isAnswerSelected ? (
            <TouchableOpacity style={styles.checkButtonDisabled} disabled>
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onCheckAnswer}
              style={styles.checkButtonEnabled}
            >
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

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
            <View style={styles.correctAnswerMessage}>
              <View style={styles.doneIconContainer}>
                <DoneSvg />
              </View>
              <Text style={styles.correctAnswerText}>Good job!</Text>
            </View>
          ) : (
            <View style={styles.correctAnswerMessage}>
              <View style={styles.closeIconContainer}>
                <BigCloseSvg />
              </View>
              <View style={styles.correctAnswerSolution}>
                <Text style={styles.correctAnswerText}>Correct solution:</Text>
                <Text style={styles.correctAnswerSolutionText}>
                  {correctAnswer}
                </Text>
              </View>
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

const ProblemSelect1Of3 = ({
  problem,
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  selectedAnswer,
  setSelectedAnswer,
  quitMessageShown,
  correctAnswerShown,
  setQuitMessageShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  onSkip,
  hearts,
  navigation,
}: {
  problem: typeof lessonProblem1;
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  selectedAnswer: number | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
  correctAnswerShown: boolean;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  hearts: number | null;
  navigation: LessonScreenNavigationProp;
}) => {
  const { question, answers, correctAnswer } = problem;

  return (
    <SafeAreaView style={styles.problemContainer}>
      <ScrollView contentContainerStyle={styles.problemScrollView}>
        <View style={styles.problemContent}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
            />
          </View>
          <View style={styles.questionSection}>
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.answerGrid}>
              {answers.map((answer, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.answerTile,
                    i === selectedAnswer && styles.answerTileSelected,
                  ]}
                  onPress={() => setSelectedAnswer(i)}
                >
                  {answer.icon}
                  <Text style={styles.answerText}>{answer.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <CheckAnswer
        correctAnswer={answers[correctAnswer].name}
        correctAnswerShown={correctAnswerShown}
        isAnswerCorrect={isAnswerCorrect}
        isAnswerSelected={selectedAnswer !== null}
        onCheckAnswer={onCheckAnswer}
        onFinish={onFinish}
        onSkip={onSkip}
      />

      <QuitMessage
        quitMessageShown={quitMessageShown}
        setQuitMessageShown={setQuitMessageShown}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const ProblemWriteInEnglish = ({
  problem,
  correctAnswerCount,
  totalCorrectAnswersNeeded,
  selectedAnswers,
  setSelectedAnswers,
  quitMessageShown,
  correctAnswerShown,
  setQuitMessageShown,
  isAnswerCorrect,
  onCheckAnswer,
  onFinish,
  onSkip,
  hearts,
  navigation,
}: {
  problem: typeof lessonProblem2;
  correctAnswerCount: number;
  totalCorrectAnswersNeeded: number;
  selectedAnswers: number[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  correctAnswerShown: boolean;
  quitMessageShown: boolean;
  setQuitMessageShown: React.Dispatch<React.SetStateAction<boolean>>;
  isAnswerCorrect: boolean;
  onCheckAnswer: () => void;
  onFinish: () => void;
  onSkip: () => void;
  hearts: number | null;
  navigation: LessonScreenNavigationProp;
}) => {
  const { question, correctAnswer, answerTiles } = problem;

  return (
    <SafeAreaView style={styles.problemContainer}>
      <ScrollView contentContainerStyle={styles.problemScrollView}>
        <View style={styles.problemContent}>
          <View style={styles.progressBarWrapper}>
            <ProgressBar
              correctAnswerCount={correctAnswerCount}
              totalCorrectAnswersNeeded={totalCorrectAnswersNeeded}
              setQuitMessageShown={setQuitMessageShown}
              hearts={hearts}
              navigation={navigation}
            />
          </View>
          <View style={styles.questionSection}>
            <Text style={styles.writeQuestionText}>Write this in English</Text>

            <View style={styles.writeInputContainer}>
              <View style={styles.imageBubbleContainer}>
                <View style={styles.speechBubble}>
                  <Text>{question}</Text>
                  <View style={styles.speechBubbleArrow} />
                </View>
              </View>

              <View style={styles.selectedAnswersContainer}>
                {selectedAnswers.map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.selectedAnswerTile}
                    onPress={() => {
                      setSelectedAnswers((currentAnswers) =>
                        currentAnswers.filter((x) => x !== i)
                      );
                    }}
                  >
                    <Text>{answerTiles[i]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.answerTilesContainer}>
              {answerTiles.map((answerTile, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.answerTileButton,
                    selectedAnswers.includes(i) &&
                      styles.answerTileButtonDisabled,
                  ]}
                  disabled={selectedAnswers.includes(i)}
                  onPress={() =>
                    setSelectedAnswers((currentAnswers) => [
                      ...currentAnswers,
                      i,
                    ])
                  }
                >
                  <Text
                    style={[
                      styles.answerTileText,
                      selectedAnswers.includes(i) &&
                        styles.answerTileTextDisabled,
                    ]}
                  >
                    {answerTile}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <CheckAnswer
        correctAnswer={correctAnswer.map((i) => answerTiles[i]).join(" ")}
        correctAnswerShown={correctAnswerShown}
        isAnswerCorrect={isAnswerCorrect}
        isAnswerSelected={selectedAnswers.length > 0}
        onCheckAnswer={onCheckAnswer}
        onFinish={onFinish}
        onSkip={onSkip}
      />

      <QuitMessage
        quitMessageShown={quitMessageShown}
        setQuitMessageShown={setQuitMessageShown}
        navigation={navigation}
      />
    </SafeAreaView>
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
  const isPractice = "practice" in route.params;

  const increaseXp = useBoundStore((x) => x.increaseXp);
  const addToday = useBoundStore((x) => x.addToday);
  const increaseLingots = useBoundStore((x) => x.increaseLingots);
  const increaseLessonsCompleted = useBoundStore(
    (x) => x.increaseLessonsCompleted
  );

  const onContinue = () => {
    increaseXp(correctAnswerCount);
    addToday();
    increaseLingots(isPractice ? 0 : 1);
    if (!isPractice) {
      increaseLessonsCompleted();
    }
    navigation.navigate("LearningPathScreen");
  };

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
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
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
