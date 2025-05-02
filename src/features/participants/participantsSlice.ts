import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Participant {
  id: string;
  groupId: string;
  name: string;
  phone?: string;
}

interface ParticipantsState {

      // Eski yapı (geriye dönük uyumluluk için)
  list: Participant[];

    // Yeni grup bazlı yapı

  byGroup: { [groupId: string]: Participant[] };
}

const initialState: ParticipantsState = {
    list: [],
  byGroup: {},
};

const participantsSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
    addParticipant: (state, action: PayloadAction<Participant>) => {
      const { groupId } = action.payload;

      // Eski yapı için
      state.list.push(action.payload);

      // byGroup'u kontrol et ve oluştur
      if (!state.byGroup) {
        state.byGroup = {}; 
      }

      // yeni grup yapısı için
      if (!state.byGroup[groupId]) {
        state.byGroup[groupId] = [];
      }
      state.byGroup[groupId].push(action.payload);
    },
    removeParticipant: (state, action: PayloadAction<{groupId: string, participantId: string}>) => {
      const { groupId, participantId } = action.payload;

      // Eski yapı için
      state.list = state.list.filter(p => p.id !== participantId);

      // yeni yapı
      if (state.byGroup[groupId]) {
        state.byGroup[groupId] = state.byGroup[groupId].filter(p => p.id !== participantId);
      }
    },
    removeGroupParticipants: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;

      // Eski yapı için
      state.list = state.list.filter(p => p.groupId !== groupId);

      // yeni yapı
      delete state.byGroup[groupId];
    },
  },
});

export const { addParticipant, removeParticipant, removeGroupParticipants } = participantsSlice.actions;
export default participantsSlice.reducer;