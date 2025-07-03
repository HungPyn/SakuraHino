let mangaChapters = [
  {
    id: 1,
    mangaTitle: "Doraemon",
    chapterNumber: 1,
    level: "N5",
    status: "approved",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 2,
    mangaTitle: "One Piece",
    chapterNumber: 1,
    level: "N4",
    status: "pending",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 3,
    mangaTitle: "Naruto",
    chapterNumber: 2,
    level: "N3",
    status: "pending",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 4,
    mangaTitle: "Conan",
    chapterNumber: 5,
    level: "N2",
    status: "approved",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 5,
    mangaTitle: "Dragon Ball",
    chapterNumber: 3,
    level: "N1",
    status: "rejected",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 6,
    mangaTitle: "Bleach",
    chapterNumber: 1,
    level: "N5",
    status: "pending",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 7,
    mangaTitle: "Attack on Titan",
    chapterNumber: 2,
    level: "N4",
    status: "approved",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 8,
    mangaTitle: "Slam Dunk",
    chapterNumber: 1,
    level: "N3",
    status: "pending",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 9,
    mangaTitle: "Death Note",
    chapterNumber: 1,
    level: "N2",
    status: "approved",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 10,
    mangaTitle: "Fairy Tail",
    chapterNumber: 4,
    level: "N1",
    status: "pending",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 11,
    mangaTitle: "Kuroko no Basket",
    chapterNumber: 2,
    level: "N5",
    status: "approved",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
  {
    id: 12,
    mangaTitle: "Haikyuu!!",
    chapterNumber: 1,
    level: "N4",
    status: "pending",
    pages: [{ pageNumber: 1, imageUrl: "", panels: [] }],
  },
];

export default {
  getMangaChapters: async () => JSON.parse(JSON.stringify(mangaChapters)),
  addMangaChapter: async (chapter) => {
    const newChapter = { ...chapter, id: Date.now(), status: "pending" };
    mangaChapters.push(newChapter);
    return newChapter;
  },
  updateMangaChapter: async (chapter) => {
    const idx = mangaChapters.findIndex((c) => c.id === chapter.id);
    if (idx > -1) mangaChapters[idx] = { ...chapter };
  },
  deleteMangaChapter: async (id) => {
    mangaChapters = mangaChapters.filter((c) => c.id !== id);
  },
};
