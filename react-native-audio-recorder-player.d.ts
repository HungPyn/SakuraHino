declare module "react-native-audio-recorder-player" {
  export default class AudioRecorderPlayer {
    startRecorder(uri?: string): Promise<string>;
    stopRecorder(): Promise<string>;
    addRecordBackListener(callback: (e: any) => void): void;
    removeRecordBackListener(): void;

    startPlayer(uri?: string): Promise<string>;
    stopPlayer(): Promise<string>;
    addPlayBackListener(callback: (e: any) => void): void;
    removePlayBackListener(): void;
  }
}
