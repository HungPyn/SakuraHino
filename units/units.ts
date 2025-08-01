export type Unit = {
  unitNumber: number;
  description: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  tiles: Tile[];
};

export type Tile =
  | {
      type: "star" | "dumbbell" | "book" | "trophy" | "fast-forward";
      description: string;
    }
  | { type: "treasure" };

export type TileType = Tile["type"];

export const units: readonly Unit[] = [
  {
    unitNumber: 1,
    description: "基本的な文章を作り、あいさつをする",
    backgroundColor: "#58cc02",
    textColor: "#58cc02",
    borderColor: "#46a302",
    tiles: [
      {
        type: "star",
        description: "基本的な文章を作る",
      },
      {
        type: "book",
        description: "おはようございます",
      },
      {
        type: "star",
        description: "あいさつをする",
      },
      { type: "treasure" },
      { type: "book", description: "デート" },
      { type: "trophy", description: "ユニット1の復習" },
    ],
  },
  {
    unitNumber: 2,
    description: "街を歩く",
    backgroundColor: "#ce82ff",
    textColor: "#ce82ff",
    borderColor: "#a568cc",
    tiles: [
      { type: "fast-forward", description: "街を歩く" },
      { type: "dumbbell", description: "個人練習" },
      { type: "book", description: "一つのこと" },
      { type: "treasure" },
      { type: "star", description: "街を歩く" },
      { type: "book", description: "とても大きな家族" },
      { type: "star", description: "あいさつをする" },
      { type: "book", description: "赤いジャケット" },
      { type: "treasure" },
      { type: "dumbbell", description: "個人練習" },
      { type: "trophy", description: "ユニット2の復習" },
    ],
  },
  {
    unitNumber: 3,
    description: "食べ物や飲み物を注文する",
    backgroundColor: "#00cd9c",
    textColor: "#00cd9c",
    borderColor: "#00a47d",
    tiles: [
      { type: "fast-forward", description: "食べ物や飲み物を注文する" },
      { type: "book", description: "パスポート" },
      { type: "star", description: "食べ物や飲み物を注文する" },
      { type: "treasure" },
      { type: "book", description: "新婚旅行" },
      { type: "star", description: "街を歩く" },
      { type: "treasure" },
      { type: "dumbbell", description: "個人練習" },
      { type: "book", description: "医者エディ" },
      { type: "trophy", description: "ユニット2の復習" },
    ],
  },
];
