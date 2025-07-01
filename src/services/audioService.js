// src/services/audioService.js

const audioItems = [
  {
    id: 1,
    title: 'Daily Japanese News: Thời tiết',
    author: 'NHK News',
    duration: '0:45',
    level: 'N4',
    topic: 'Tin tức',
    src: 'https://file-examples.com/storage/fe/2017/11/file_example_MP3_700KB.mp3', // Example MP3 URL
    transcript: '今日の天気は晴れのち曇り、所により雨が降るでしょう。最高気温は25度、最低気温は15度です。',
    views: 1500,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Japanese Conversation: Gọi món',
    author: 'Japanese Pod 101',
    duration: '1:20',
    level: 'N5',
    topic: 'Giao tiếp',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Example MP3 URL
    transcript: 'いらっしゃいませ。ご注文はお決まりですか？はい、カレーライスをお願いします。飲み物はいかがですか？コーラをお願いします。',
    views: 2300,
    createdAt: '2024-01-18'
  },
  {
    id: 3,
    title: 'Intermediate Japanese Listening: Mẹo du lịch',
    author: 'JLPT Prep',
    duration: '2:10',
    level: 'N3',
    topic: 'Du lịch',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Example MP3 URL
    transcript: '日本の旅行では、交通手段として電車が非常に便利です。特に、JRパスを使うと、新幹線も乗り放題になり、お得です。荷物は少なめにすることをお勧めします。',
    views: 1800,
    createdAt: '2024-02-01'
  },
  {
    id: 4,
    title: 'Advanced Japanese News: Kinh tế',
    author: 'Asahi Shimbun',
    duration: '3:00',
    level: 'N1',
    topic: 'Kinh tế',
    src: 'https://file-examples.com/storage/fe/2017/11/file_example_MP3_1MB.mp3', // Example MP3 URL
    transcript: '最近の経済指標によると、日本の景気は緩やかに回復している兆しが見られます。しかし、世界経済の不確 định性が依然として存在するため、予断を許さない状況が続いています。',
    views: 900,
    createdAt: '2024-02-05'
  }
];

export const getAllAudioItems = () => {
  return Promise.resolve(audioItems);
};
