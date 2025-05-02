import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { shuffleOrder } from '../features/schedules/schedulesSlice';

interface DrawOrderProps {
    groupId?: string;
}

const DrawOrder: React.FC<DrawOrderProps> = ({ groupId }) => {
  // Bu gruba ait katılımcıları al
  const participants = useSelector((state: RootState) => {
    if (!state.participants.byGroup || !groupId) {
      return [];
    }
    return state.participants.byGroup[groupId] || [];
  });

  // Sadece bu gruba ait sıralamayı al
  const order = useSelector((state: RootState) => {
    if (!state.schedules.orderByGroup || !groupId) {
      return [];
    }
    return state.schedules.orderByGroup[groupId] || [];
  });
  const dispatch = useDispatch();

  // Başarılı mesajı için state

  const [showSuccess, setShowSucsess] = useState(false);
  
  // Otomatik kura çekimi
  const handleAutomaticDraw = () => {
    if (!groupId || participants.length === 0) return;

    const participantIds = participants.map(p => p.id);

      // Katılımcıları karıştır
      //const shuffledIds = [...participants.map(p => p.id)].sort(() => Math.random() - 0.5);

  // Yeni sıralamayı kaydet - grup ID'sine göre
    dispatch(shuffleOrder({ 
        groupId, 
        order: participantIds 
    }));

    // Başarı mesajını göster
  setShowSucsess(true);

  // 3 saniye sonra mesajı kapat
  setTimeout(() => {
    setShowSucsess(false);
  }, 3000);

  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kura Çekimi</h2>
      
      {/* Başarı mesajı */}
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>Kura başarıyla çekildi! Aylık Program sekmesine gidip yeni sıralamayı görebilirsiniz.</p>
          </div>
        </div>
      )}
      
      {participants.length === 0 ? (
        <p className="text-gray-500">Önce katılımcı eklemelisiniz.</p>
      ) : (
        <>
          <div className="mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleAutomaticDraw}
            >
              Otomatik Kura Çek
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Kura çekildiğinde sıralama rastgele belirlenecek ve kaydedilecektir.
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Günün Sıralaması</h3>
            {order.length === 0 ? (
              <p className="text-gray-500">Henüz kura çekilmedi.</p>
            ) : (
              <div className="border rounded">
                <ul className="divide-y">
                  {order.map((id, index) => {
                    const participant = participants.find(p => p.id === id);
                    if (!participant) return null;
                    
                    return (
                      <li key={id} className="p-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium">{participant.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DrawOrder;