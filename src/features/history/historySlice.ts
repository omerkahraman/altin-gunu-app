import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoryEntry {
  id: string;
  groupId: string;
  date: string;
  participantId: string;
  dayTypeId: string;
  status: 'completed' | 'canceled';
  note?: string;
}

interface HistoryState {
  // Eski yapı (geriye dönük uyumluluk için)
  entries: HistoryEntry[];
  
  // Yeni grup bazlı yapı
  byGroup: { [groupId: string]: HistoryEntry[] };
}

const initialState: HistoryState = {
  entries: [],
  byGroup: {},
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryEntry: (state, action: PayloadAction<HistoryEntry>) => {
      const { groupId } = action.payload;
      
      // Eski yapı için
      state.entries.push(action.payload);

      // byGroup'u kontrol et ve oluştur
      if (!state.byGroup) {
        state.byGroup = {};
      }
      
      // Yeni grup yapısı için
      if (!state.byGroup[groupId]) {
        state.byGroup[groupId] = [];
      }
      state.byGroup[groupId].push(action.payload);
    },
    updateHistoryEntry: (state, action: PayloadAction<HistoryEntry>) => {
      const { id, groupId } = action.payload;
      
      // Eski yapı için
      const index = state.entries.findIndex(entry => entry.id === id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
      
      // Yeni grup yapısı için
      if (state.byGroup[groupId]) {
        const groupIndex = state.byGroup[groupId].findIndex(entry => entry.id === id);
        if (groupIndex !== -1) {
          state.byGroup[groupId][groupIndex] = action.payload;
        }
      }
    },
    removeGroupHistory: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      
      // Eski yapı için
      state.entries = state.entries.filter(entry => entry.groupId !== groupId);
      
      // Yeni grup yapısı için
      delete state.byGroup[groupId];
    },
  },
});

export const { 
  addHistoryEntry, 
  updateHistoryEntry,
  removeGroupHistory
} = historySlice.actions;
export default historySlice.reducer;