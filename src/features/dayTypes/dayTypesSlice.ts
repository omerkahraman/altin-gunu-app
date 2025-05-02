import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DayType {
  id: string;
  groupId: string;
  name: string;
}

interface DayTypesState {

    // Eski yapı (geriye dönük uyumluluk için)
  list: DayType[];
  selectedDayType: string | null;


  byGroup: { [groupId: string]: DayType[] };
  selectedByGroup: { [groupId: string]: string | null };
}

const initialState: DayTypesState = {
    list: [],
  selectedDayType: null,
  byGroup: {},
  selectedByGroup: {},
};

const dayTypesSlice = createSlice({
  name: 'dayTypes',
  initialState,
  reducers: {
    addDayType: (state, action: PayloadAction<DayType>) => {
      const { groupId } = action.payload;

       // Eski yapı için
       state.list.push(action.payload);

            // Yeni grup yapısı için - byGroup her zaman var olacak şekilde

      if (!state.byGroup) {
        state.byGroup = {};
      }

      if (!state.byGroup[groupId]) {
        state.byGroup[groupId] = [];
      }
      state.byGroup[groupId].push(action.payload);
    },
    selectDayType: (state, action: PayloadAction<{groupId: string, dayTypeId: string}>) => {
      const { groupId, dayTypeId } = action.payload;

      // Eski yapı için
      state.selectedDayType = dayTypeId;

      // Yeni grup yapısı için - selectedByGroup her zaman var olacak şekilde
      if (!state.selectedByGroup) {
        state.selectedByGroup = {};
      }

      // yeni
      state.selectedByGroup[groupId] = dayTypeId;
    },
    addDefaultDayTypes: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;

      // byGroup yoksa oluştur
      if (!state.byGroup) {
        state.byGroup = {};
      }

      // Grup için hazırsa tekrar ekleme
      if (state.byGroup[groupId] && state.byGroup[groupId].length > 0) {
        return;
      }

       // Yeni grup yapısı için     
      if (!state.byGroup[groupId]) {
        state.byGroup[groupId] = [];
      }
      
            // Varsayılan gün türleri

      const defaultTypes = [
        { id: `${groupId}-1`, groupId, name: 'Altın' },
        { id: `${groupId}-2`, groupId, name: 'Çeyrek' },
        { id: `${groupId}-3`, groupId, name: 'Para' },
        { id: `${groupId}-4`, groupId, name: 'Hediye' },
      ];
      
     // Hem eski hem de yeni yapı için ekle
     defaultTypes.forEach(type => {
        state.list.push(type);
        state.byGroup[groupId].push(type);
      });
    },
    removeGroupDayTypes: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
       // Eski yapı için
       state.list = state.list.filter(dt => dt.groupId !== groupId);
       if (state.selectedDayType && state.list.find(dt => dt.id === state.selectedDayType)?.groupId === groupId) {
         state.selectedDayType = null;
       }
// Yeni grup yapısı için - byGroup ve selectedByGroup kontrol et
if (state.byGroup) {
  delete state.byGroup[groupId];
}

if (state.selectedByGroup) {
  delete state.selectedByGroup[groupId];
}
    },
  },
});

export const { addDayType, selectDayType, addDefaultDayTypes, removeGroupDayTypes } = dayTypesSlice.actions;
export default dayTypesSlice.reducer;