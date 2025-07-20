// components/lessons/LessonRenderer.tsx
import React from 'react';
import ListeningLesson from './ListeningLesson';
import SpeakingLesson from './SpeakingLesson';
import ReadingLesson from './ReadingLesson';
import WritingLesson from './WritingLesson';

interface LessonRendererProps {
  type: 'listening' | 'speaking' | 'reading' | 'writing';
}

const LessonRenderer: React.FC<LessonRendererProps> = ({ type }) => {
  switch (type) {
    case 'listening':
      return <ListeningLesson />;
    case 'speaking':
      return <SpeakingLesson />;
    case 'reading':
      return <ReadingLesson />;
    case 'writing':
      return <WritingLesson />;
    default:
      return null;
  }
};

export default LessonRenderer;
