import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addDayType, selectDayType, DayType } from '../features/dayTypes/dayTypesSlice';

interface DayTypeSelectorProps {
    groupId?: string;
    onContinue?: () => void; 
  }

const DayTypeSelector: React.FC<DayTypeSelectorProps> = ({ groupId, onContinue }) => {
  const [newDayTypeName, setNewDayTypeName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // Başarı mesajı için 

  // Grup bazlı seçili gün türü. Seçili gün tipini en üstte çağır, callback içinde değil

  const selectedDayTypeId = useSelector((state: RootState) => {
    if (!state.dayTypes.selectedByGroup || !groupId) {
      return null;
    }
    return state.dayTypes.selectedByGroup[groupId] || null;
  });

    // Güvenli selektörler kullan - varsayılan boş değerler ver

    const dayTypes = useSelector((state: RootState) => {
        if (!state.dayTypes.byGroup || !groupId) {
          return [];
        }
        return state.dayTypes.byGroup[groupId] || [];
      });
  

  const dispatch = useDispatch();
  
  const handleAddDayType = () => {
    if (!groupId || newDayTypeName.trim() === '') return;
    
    const newDayType: DayType = {
      id: Date.now().toString(),
      groupId,
      name: newDayTypeName.trim()
    };
    
    dispatch(addDayType(newDayType));
    setNewDayTypeName('');
  };
  
  const handleSelectDayType = (id: string) => {
    if(!groupId) return;

    dispatch(selectDayType({ groupId, dayTypeId: id }));

    // Başarı mesajını göster
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Devam butonu için ayrı bir işleyici fonksiyon oluştur
  const handleContinue = () => {
    if (!selectedDayTypeId) {
      alert('Devam etmek için önce bir gün türü seçmelisiniz.');
      return;
    }
    
    if (onContinue) {
      onContinue();
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gün Türü Seçimi</h2>

      {/* Başarı mesajı */}
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>Gün türü seçildi!</p>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <p className="mb-2 text-gray-700">Mevcut günün türünü seçin:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {dayTypes.map((dayType) => (
            <button
              key={dayType.id}
              className={`p-3 border rounded text-center ${
                selectedDayTypeId === dayType.id 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => handleSelectDayType(dayType.id)}
            >
              {dayType.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Yeni Gün Türü Ekle</h3>
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded-l p-2"
            placeholder="Yeni gün türü adı"
            value={newDayTypeName}
            onChange={(e) => setNewDayTypeName(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
            onClick={handleAddDayType}
          >
            Ekle
          </button>
        </div>
      </div>

      {/* onContinue butonu ekleyin, onContinue için ayrı bir işleyici fonksiyon kullan  */}
      {onContinue && (
        <div className="mt-6 flex justify-end">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleContinue}
          >
            Devam Et
          </button>
        </div>
      )}
    </div>
  );
};

export default DayTypeSelector;