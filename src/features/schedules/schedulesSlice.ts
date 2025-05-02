import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Schedule {
  id: string;
  groupId: string;
  month: string;
  year: string;
  date: string;
  participantId: string;
  note?: string;
  status: 'planned' | 'completed' | 'canceled';
}

interface SchedulesState {
  // Eski yapı (geriye dönük uyumluluk için)
  list: Schedule[];
  order: string[];
  
  // Yeni grup bazlı yapı
  byGroup: { [groupId: string]: Schedule[] };
  orderByGroup: { [groupId: string]: string[] };
}

const initialState: SchedulesState = {
  list: [],
  order: [],
  byGroup: {},
  orderByGroup: {},
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    addSchedule: (state, action: PayloadAction<Schedule>) => {
      const { groupId } = action.payload;
      
      // Eski yapı için
      state.list.push(action.payload);

      // byGroup'u kontrol et ve oluştur
      if (!state.byGroup) {
        state.byGroup = {}; 
      }
      
      // Yeni grup yapısı için
      if (!state.byGroup[groupId]) {
        state.byGroup[groupId] = [];
      }
      
      // Aynı ay ve yıl için plan var mı kontrol et
      const existingInGroup = state.byGroup[groupId].find(
        s => s.year === action.payload.year && s.month === action.payload.month
      );
      
      // Yoksa ekle
      if (!existingInGroup) {
        state.byGroup[groupId].push(action.payload);
      }
    },
    updateSchedule: (state, action: PayloadAction<Schedule>) => {
      const { id, groupId } = action.payload;
      
      // Eski yapı için
      const index = state.list.findIndex(schedule => schedule.id === id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      
      // Yeni grup yapısı için
      if (state.byGroup[groupId]) {
        const groupIndex = state.byGroup[groupId].findIndex(s => s.id === id);
        if (groupIndex !== -1) {
          state.byGroup[groupId][groupIndex] = action.payload;
        }
      }
    },
    setOrder: (state, action: PayloadAction<{groupId: string, order: string[]}>) => {
      const { groupId, order } = action.payload;
      
      // Eski yapı için
      state.order = order;

       // orderByGroup'u kontrol et ve oluştur
       if (!state.orderByGroup) {
        state.orderByGroup = {};
      }
      
      // Yeni grup yapısı için
      state.orderByGroup[groupId] = order;
    },
    shuffleOrder: (state, action: PayloadAction<{groupId: string, order: string[]}>) => {
      const { groupId, order } = action.payload;
      const shuffled = [...order].sort(() => Math.random() - 0.5);
      
      // Eski yapı için
      state.order = shuffled;
      
      // Yeni grup yapısı için
      state.orderByGroup[groupId] = shuffled;
      
      // Kura yeniden çekildiğinde planlanmış ayları temizle
      if (state.byGroup[groupId]) {
        state.byGroup[groupId] = state.byGroup[groupId].filter(s => s.status !== 'planned');
      }
      
      // Eski yapı için de planlananları temizle
      state.list = state.list.filter(s => s.groupId !== groupId || s.status !== 'planned');
    },
    clearPlannedSchedules: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      
      // Eski yapı için
      state.list = state.list.filter(s => s.groupId !== groupId || s.status !== 'planned');
      
      // Yeni grup yapısı için
      if (state.byGroup[groupId]) {
        state.byGroup[groupId] = state.byGroup[groupId].filter(s => s.status !== 'planned');
      }
    },
    removeGroupSchedules: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      
      // Eski yapı için
      state.list = state.list.filter(s => s.groupId !== groupId);
      
      // Yeni grup yapısı için
      delete state.byGroup[groupId];
      delete state.orderByGroup[groupId];
    },
  },
});

export const { 
  addSchedule, 
  updateSchedule, 
  setOrder, 
  shuffleOrder,
  clearPlannedSchedules,
  removeGroupSchedules
} = schedulesSlice.actions;
export default schedulesSlice.reducer;