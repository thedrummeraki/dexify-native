export interface SavedPositions {
  [key: string]: {x: number; y: number} | undefined;
}

export interface ReaderStore {
  savedPositions: SavedPositions;
}

export const defaultReaderStore: ReaderStore = {
  savedPositions: {},
};
