import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface HistoryProps {
    groupId?: string;
}

const History: React.FC<HistoryProps> = ({ groupId }) => {
  // Sadece bu gruba ait verileri al
  const participants = useSelector((state: RootState) => 
    state.participants.byGroup[groupId || ''] || []
  );
  const dayTypes = useSelector((state: RootState) => 
    state.dayTypes.byGroup[groupId || ''] || []
  );
  
  const schedules = useSelector((state: RootState) => 
    state.schedules.byGroup[groupId || ''] || []
  );

  const historyEntries = useSelector((state: RootState) => {
    if (!state.history.byGroup || !groupId) {
      return [];
    }
    return state.history.byGroup[groupId] || [];
  });
    
  // Tamamlanmış veya iptal edilmiş günlerin listesi
  const pastEvents = useMemo(() => {
    return schedules
      .filter(s => s.status === 'completed' || s.status === 'canceled')
      .sort((a, b) => {
        // Tarihe göre sırala (yeni -> eski)
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [schedules]);
  
  // Katılımcı adını ID'ye göre bul
  const getParticipantName = (id: string) => {
    const participant = participants.find(p => p.id === id);
    return participant ? participant.name : 'Katılımcı bulunamadı';
  };
  
  // Ay adını al
  const getMonthName = (monthNumber: number) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[monthNumber - 1];
  };
  
  // Tarihi formatlı göster
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Tarih belirtilmedi';
    
    try {
      // YYYY-MM-DD formatında tarih işleme
      if (dateString.includes('-') && !dateString.includes('T')) {
        const [year, month, day] = dateString.split('-').map(Number);
        // Ay değerini olduğu gibi kullan - month-1 yerine direkt month değerini kullan
        return `${day} ${getMonthName(month)} ${year}`;
      } else {
        // ISO format için
        const date = new Date(dateString);
        return `${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
      }
    } catch (error) {
      console.error('Tarih formatı hatası:', error);
      return 'Geçersiz tarih formatı';
    }
  };

  const allHistoryEntries = useMemo(() => {
        // Tarihe göre sırala ve aynı tarihli kayıtları alt alta getir

    return [...historyEntries].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Önce tarihe göre sırala
        const dateCompare = dateB.getTime() - dateA.getTime();
        if(dateCompare !== 0) return dateCompare;

        // Aynı tarihte olan kayıtların sırasını koru
        const statusOrder = { 'planned': 0, 'completed': 1, 'canceled': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [historyEntries]);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Geçmiş</h2>
      
      {allHistoryEntries.length === 0 ? (
        <p className="text-gray-500">Henüz geçmiş kaydı bulunmuyor.</p>
      ) : (
        <div className="divide-y border rounded">
          {allHistoryEntries.map(entry => (
            <div 
              key={entry.id} 
              className={`p-4 ${
                entry.status === 'canceled' ? 'bg-red-50' : 
                entry.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  {formatDate(entry.date)}
                </h3>
                <span 
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    entry.status === 'completed' 
                      ? 'bg-green-200 text-green-800' 
                      : entry.status === 'canceled' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {entry.status === 'completed' ? 'Tamamlandı' : 
                  entry.status === 'canceled' ? 'İptal Edildi' : 'Planlandı'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-2">
                <div>
                  <p className="text-sm text-gray-500">Ev Sahibi</p>
                  <p>{getParticipantName(entry.participantId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gün Türü</p>
                  <p>{dayTypes.find(dt => dt.id === entry.dayTypeId)?.name || 'Belirtilmedi'}</p>
                </div>
              </div>
              
              {entry.note && (
                <div className="mt-3 bg-white p-2 rounded border text-sm">
                  <p className="font-medium text-gray-500 mb-1">Not:</p>
                  <p>{entry.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;