import React, { useDebugValue, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { shuffleOrder } from '../features/schedules/schedulesSlice';
import confetti from 'canvas-confetti'; 

interface DrawOrderProps {
    groupId?: string;
}

const DrawOrder: React.FC<DrawOrderProps> = ({ groupId }) => {
     // State tanımlamaları
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(10);
  const [drawComplete, setDrawComplete] = useState(false);
  const [shufflingNames, setShufflingNames] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

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

  // İsim karıştırma efekti için 
  useEffect(() => {
    if(showCountdown && !drawComplete && participants.length > 0) {
        const interval = setInterval(() => {
            // Katılımcı isimlerini rastgele karıştır ve göster 
            const shuffled = [...participants]
                .sort(() => Math.random() - 0.5)
                .slice(0, 5) // sadece ilk 5 kişiyi göster
                .map(p => p.name);

            setShufflingNames(shuffled);
        }, 200); 

        return () => clearInterval(interval);
    }

  }, [showCountdown, drawComplete, participants])

  // Geri sayım efekti
  useEffect(() => {
    if (showCountdown && countdownValue > 0) {
        const timer = setTimeout(() => {
            setCountdownValue(countdownValue - 1);
        }, 1000);

        return () => clearTimeout(timer);
    } else if (showCountdown && countdownValue === 0) {
        // Geri sayım tammamlandığında
        setDrawComplete(true);

        // Konfeti efekti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Gerçek kura çekimi işlemini yap
        if(groupId && participants.length > 0){
            const participantIds = participants.map(p => p.id);
            dispatch(shuffleOrder({
                groupId,
                order: participantIds
            }));
        }
    }
  }, [showCountdown, countdownValue, dispatch, groupId, participants]);
  
  // Otomatik kura çekimi
  const handleAutomaticDraw = () => {
    if (!groupId || participants.length === 0) return;

    // Geri sayımı başlat
    setShowCountdown(true);
    setCountdownValue(10);
    setDrawComplete(false);
  };


  // Kura sonuçlarını göster 
  const handleShowResults = () => {
    setShowCountdown(false);
    setDrawComplete(false);
    setShowSuccess(true);
    
    // 3 saniye sonra başarı mesajını kapat
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  
  return (
    <div className="relative">
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
              disabled={showCountdown}
            >
              Otomatik Kura Çek
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Kura çekildiğinde sıralama rastgele belirlenecek ve kaydedilecektir.
            </p>
          </div>
        
        {/* Geri sayım modalı */}
        {showCountdown && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                {!drawComplete ? (
                  <>
                    <div className="flex justify-center mb-6">
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-blue-500 text-4xl font-bold transition-all duration-1000 ${
                        countdownValue <= 3 ? 'text-red-500 border-red-500' : 'text-blue-500'
                      }`}>
                        {countdownValue}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Kura Çekiliyor...</h3>
                    
                    {/* Karışan isimler listesi */}
                    <div className="h-40 overflow-hidden bg-gray-50 rounded mb-4 flex flex-col justify-center">
                      {shufflingNames.map((name, index) => (
                        <div key={index} className="py-1 text-gray-800 animate-pulse">
                          {name}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-gray-600">
                      Katılımcılar karıştırılıyor, lütfen bekleyin...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center mb-6">
                      <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-green-500 bg-green-500 text-white">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Kura Çekimi Tamamlandı!</h3>
                    <p className="text-gray-600 mb-6">
                      Kura çekimi başarıyla tamamlandı. Sonuçları görmek için aşağıdaki butona tıklayın.
                    </p>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                      onClick={handleShowResults}
                    >
                      Sonuçları Göster
                    </button>
                  </>
                )}
              </div>
            </div>
          )}


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