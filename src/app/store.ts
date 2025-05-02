import { configureStore, combineReducers } from '@reduxjs/toolkit';
import participantsReducer from '../features/participants/participantsSlice';
import dayTypesReducer from '../features/dayTypes/dayTypesSlice';
import schedulesReducer from '../features/schedules/schedulesSlice';
import historyReducer from '../features/history/historySlice';
import groupsReducer from '../features/groups/groupsSlice';

// Tüm reducer'ları tek bir reducer'a birleştir
const rootReducer = combineReducers({
    participants: participantsReducer,
    dayTypes: dayTypesReducer,
    schedules: schedulesReducer,
    history: historyReducer,
    groups: groupsReducer
  });

  // Redux state tipini tanımla
export type RootState = ReturnType<typeof rootReducer>;

// Local Storage'dan verileri yükle
const loadState = () => {
    try {
      const serializedState = localStorage.getItem('altinGunuState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error('State yüklenirken hata oluştu:', err);
      return undefined;
    }
  };

  // Local Storage'a verileri kaydet
const saveState = (state: any) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('altinGunuState', serializedState);
    } catch (err) {
      console.error('State kaydedilirken hata oluştu:', err);
    }
  };

  // Önceki state'i yükle
const persistedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
   // Önceki state varsa, başlangıç değeri olarak kullan
   preloadedState: persistedState,
});

// State değiştiğinde local storage'a kaydet
store.subscribe(() => {
    saveState(store.getState());
  });

export type AppDispatch = typeof store.dispatch;