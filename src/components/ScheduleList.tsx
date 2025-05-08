import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addSchedule, updateSchedule, Schedule } from '../features/schedules/schedulesSlice';
import { addHistoryEntry } from '../features/history/historySlice';


// Modal bileşeni
    const Modal = ({ isOpen, onClose, title, message, onConfirm }: {
        isOpen: boolean,
        onClose: () => void,
        title: string,
        message: string,
        onConfirm: () => void
    }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="mb-6 whitespace-pre-line">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              İptal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Onayla
            </button>
          </div>
        </div>
      </div>
    );
  };
interface ScheduleListProps {
    groupId?: string;
  }

const ScheduleList: React.FC<ScheduleListProps> = ({ groupId }) => {
 // Sadece bu gruba ait verileri al
 const participants = useSelector((state: RootState) => {
    if (!state.participants.byGroup || !groupId) {
      return [];
    }
    return state.participants.byGroup[groupId] || [];
  });
  
  const order = useSelector((state: RootState) => {
    if (!state.schedules.orderByGroup || !groupId) {
      return [];
    }
    return state.schedules.orderByGroup[groupId] || [];
  });
  
  const schedules = useSelector((state: RootState) => {
    if (!state.schedules.byGroup || !groupId) {
      return [];
    }
    return state.schedules.byGroup[groupId] || [];
  });
  
  const dayTypes = useSelector((state: RootState) => 
    state.dayTypes.byGroup[groupId || ''] || []
  );
  
  const selectedDayTypeId = useSelector((state: RootState) => 
    state.dayTypes.selectedByGroup[groupId || ''] || null
  );

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const dispatch = useDispatch();
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12 arası
  
  const [year, setYear] = useState(currentYear.toString());
  const [currentNote, setCurrentNote] = useState<{[key: string]: string}>({});
  
  // Kura çekiminden sonra, sadece katılımcı sayısı kadar ay için plan oluştur
  useEffect(() => {
    if (participants.length === 0 || order.length === 0 || !groupId) return;
    
    // Önce mevcut tarihi al
    const startMonth = currentMonth + 1; // Kuranın çekildiği aydan sonraki ay
    const startYear = currentYear;
    
    // Eski planları temizle
    // Burada Redux store'daki tüm planları silmek için bir action eklemelisin
    // Şimdilik sadece yenilerini oluşturacağız
    
    // Kuraya katılan kişi sayısı kadar ay için plan oluştur
    for (let i = 0; i < participants.length; i++) {
      let targetMonth = startMonth + i;
      let targetYear = startYear;
      
      // Ay 12'den büyükse, yılı artır ve ayı düzelt
      while (targetMonth > 12) {
        targetMonth -= 12;
        targetYear += 1;
      }
      
      const monthKey = `${targetYear}-${targetMonth}`;
      
      // Bu ay için zaten bir plan var mı kontrol et
      const existingSchedule = schedules.find(s => 
        s.year === targetYear.toString() && 
        s.month === targetMonth.toString() &&
        s.groupId === groupId // groupId filtreleme eklendi
      );
      
      if (!existingSchedule) {
        // Kura sırasına göre ev sahibini belirle
        const hostId = order[i % order.length];
        
        // Yeni plan oluştur
        const newSchedule: Schedule = {
          id: monthKey,
          groupId: groupId || "", 
          year: targetYear.toString(),
          month: targetMonth.toString(),
          date: '', // tarih seçilmedi
          participantId: hostId,
          status: 'planned'
        };
        
        dispatch(addSchedule(newSchedule));
      }
    }
  }, [order, participants, currentMonth, currentYear, schedules, dispatch, groupId]);
  
  // Tarih güncelleme
  const handleDateChange = (scheduleId: string, date: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      const updatedSchedule = {
        ...schedule,
        date
      };
      dispatch(updateSchedule(updatedSchedule));
    }
  };
  
  // Not güncelleme ve durum değişikliği
  const handleSaveNote = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
        if(!schedule.date) {
            setModal({
                isOpen: true,
                title: 'Uyarı',
                message: 'Lütfen bir tarih seçin',
                onConfirm: () => setModal({...modal, isOpen: false})
            });
            return;
        }

      // Not değerini al
      const noteValue = currentNote[scheduleId] || schedule.note || '';
      
      const updatedSchedule = {
        ...schedule,
        note: noteValue
      };

      //Onay mesajı
      const confirmMessage = `Seçilen tarih: ${new Date(schedule.date).toLocaleDateString('tr-TR')}\n`+
      `Durum: ${schedule.status === 'planned' ? 'Planlandı' :
               schedule.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}\n` +
      `Not: ${updatedSchedule.note}\n\n` +
      'Bu bilgileri kaydetmek istediğinize emin misiniz?';

      setModal({
        isOpen: true,
        title: 'Onay',
        message: confirmMessage,
        onConfirm: () => {
            // Not değerini updatedSchedule'a set et ve Redux'a gönder
            dispatch(updateSchedule({
              ...updatedSchedule,
              note: noteValue
            }));

            dispatch(addHistoryEntry({
                id: Date.now().toString(),
                groupId: groupId || '',
                date: schedule.date,
                participantId: updatedSchedule.participantId,
                dayTypeId: selectedDayTypeId || '',
                status: schedule.status,
                note: noteValue,
                scheduleId: schedule.id
            }));
            
            // Not alanını temizle
            setCurrentNote({
              ...currentNote,
              [scheduleId]: '' // Sadece ilgili program için not alanını temizle
            });
            
            setModal({...modal, isOpen: false});
        }
      });
    }
  };
  
  // Durumu güncelleme
  const handleStatusChange = (scheduleId: string, status: 'planned' | 'completed' | 'canceled') => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
        if(!schedule.date) {
            setModal({
                isOpen: true,
                title: 'Uyarı',
                message: 'Lütfen bir tarih seçin',
                onConfirm: () => setModal({ ...modal, isOpen: false })
              });            
              return;
        }

        const updatedSchedule = {
            ...schedule,
            status
        };

        dispatch(updateSchedule(updatedSchedule));

        dispatch(addHistoryEntry({
            id: Date.now().toString(),
            groupId: groupId || '',
            date: schedule.date,
            participantId: updatedSchedule.participantId,
            dayTypeId: selectedDayTypeId || '',
            status: status,
            note: schedule.note || '',
            scheduleId: schedule.id
        }));
    }
  };
  
  // Aylar için Türkçe isimler
  const getMonthName = (monthNumber: number) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[monthNumber - 1];
  };
  
  // Katılımcı adını ID'ye göre bul
  const getParticipantName = (id: string) => {
    const participant = participants.find(p => p.id === id);
    return participant ? participant.name : 'Katılımcı bulunamadı';
  };
  
  // Ev sahibi değiştirme
  const handleChangeHost = (scheduleId: string, participantId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      dispatch(updateSchedule({
        ...schedule,
        participantId
      }));
    }
  };
  
  // Planları filtreleyip, sadece bu yıl ve sıradaki aylara ait olanları göster 
  const filteredSchedules = schedules
    .filter(s => s.year === year)
    // Her ay için sadece bir tane göster (tekrarları önle)
    .filter((schedule, index, self) => 
      index === self.findIndex(s => s.month === schedule.month && s.year === schedule.year)
    )
    .sort((a, b) => parseInt(a.month) - parseInt(b.month));
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Aylık Program</h2>
      
      {!selectedDayTypeId && (
        <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          Önce "Gün Türü" sekmesinden bir gün türü seçmelisiniz.
        </div>
      )}
      
      {(participants.length === 0 || order.length === 0) ? (
        <p className="text-gray-500">Önce katılımcı ekleyin ve kura çekin.</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Yıl:</label>
            <select
              className="border rounded p-2"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value={currentYear.toString()}>{currentYear}</option>
              <option value={(currentYear+1).toString()}>{currentYear+1}</option>
              <option value={(currentYear+2).toString()}>{currentYear+2}</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Kura çekildikten sonra bir sonraki aydan itibaren katılımcı sayısı kadar ay listelenir.
            </p>
          </div>
          
          {filteredSchedules.length === 0 ? (
            <p className="text-gray-500">Bu yıl için planlanmış gün bulunmuyor.</p>
          ) : (
            <div className="grid gap-4">
              {filteredSchedules.map(schedule => {
                //const monthName = getMonthName(parseInt(schedule.month));
                return (
                  <div key={schedule.id} className="border rounded p-4">
                    <div className="flex flex-col md:flex-row justify-between mb-3">
                      {/* <h3 className="text-lg font-medium">{monthName} {schedule.year}</h3> */}
                      <div className="mt-2 md:mt-0">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {dayTypes.find(dt => dt.id === selectedDayTypeId)?.name || 'Gün türü seçilmedi'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-1 text-sm font-medium text-gray-700">Ev Sahibi:</p>
                        <select
                          className="border rounded p-2 w-full"
                          value={schedule.participantId}
                          onChange={(e) => handleChangeHost(schedule.id, e.target.value)}
                        >
                          {participants.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <p className="mb-1 text-sm font-medium text-gray-700">Tarih:</p>
                        <input
                          type="date"
                          className="border rounded p-2 w-full"
                          value={schedule.date}
                          onChange={(e) => handleDateChange(schedule.id, e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="mb-1 text-sm font-medium text-gray-700">Durum:</p>
                      <div className="flex space-x-2">
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            schedule.status === 'planned' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                          onClick={() => handleStatusChange(schedule.id, 'planned')}
                        >
                          Planlandı
                        </button>
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            schedule.status === 'completed' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                          onClick={() => handleStatusChange(schedule.id, 'completed')}
                        >
                          Tamamlandı
                        </button>
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            schedule.status === 'canceled' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                          onClick={() => handleStatusChange(schedule.id, 'canceled')}
                        >
                          İptal Edildi
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="mb-1 text-sm font-medium text-gray-700">Not:</p>
                      <div className="flex">
                        <textarea
                          className="border rounded-l p-2 flex-1"
                          rows={2}
                          placeholder="Not ekle..."
                          value={currentNote[schedule.id] !== undefined ? currentNote[schedule.id] : schedule.note || ''}
                          onChange={(e) => setCurrentNote({
                            ...currentNote,
                            [schedule.id]: e.target.value
                          })}
                        />
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r"
                          onClick={() => handleSaveNote(schedule.id)}
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default ScheduleList;