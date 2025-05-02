import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Group {
  id: string;
  name: string;
  createdAt: string; // ISO tarih formatı
}

interface GroupsState {
  list: Group[];
  activeGroupId: string | null;
}

const initialState: GroupsState = {
  list: [],
  activeGroupId: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) => {
      state.list.push(action.payload);
      // Yeni grup otomatik olarak aktif hale gelir
      state.activeGroupId = action.payload.id;
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.list.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(group => group.id !== action.payload);
      // Eğer silinen grup aktifse, aktif grubu temizle
      if (state.activeGroupId === action.payload) {
        state.activeGroupId = null;
      }
    },
    setActiveGroupId: (state, action: PayloadAction<string | null>) => {
      state.activeGroupId = action.payload;
    },
  },
});

export const { addGroup, updateGroup, deleteGroup, setActiveGroupId } = groupsSlice.actions;
export default groupsSlice.reducer;