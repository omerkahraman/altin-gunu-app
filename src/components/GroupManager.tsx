import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { updateGroup } from '../features/groups/groupsSlice';
import ParticipantsList from './ParticipantsList';
import DayTypeSelector from './DayTypeSelector';
import DrawOrder from './DrawOrder';
import ScheduleList from './ScheduleList';
import History from './History';

interface GroupManagerProps {
  groupId?: string;
}

const GroupManager: React.FC<GroupManagerProps> = ({ groupId }) => {
  const dispatch = useDispatch();
  
  // Aktif grubu Redux store'dan al
  const group = useSelector((state: RootState) => 
    state.groups.list.find(g => g.id === groupId));
  
  const [groupName, setGroupName] = useState(group?.name || '');
  const [activeTab, setActiveTab] = useState<string>('participants');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Grup değiştiğinde state'i güncelle
  useEffect(() => {
    if (group) {
      setGroupName(group.name);
    }
  }, [group]);
  
  // Grup bilgilerini güncelle
  const handleUpdateGroup = () => {
    if (!group || !groupId || groupName.trim() === '') return;
    
    const updatedGroup = {
      ...group,
      name: groupName.trim()
    };
    
    dispatch(updateGroup(updatedGroup));
    
    // Başarı mesajını göster
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };
  
  const handleTabChange = (tabName: string) => {
    // Gün türü seçiminden başka sekmeye geçince başarı mesajı göster
    if (activeTab === 'dayType' && tabName !== 'dayType') {
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }
    
    setActiveTab(tabName);
  };
  
  // Grup yoksa mesaj göster
  if (!group) {
    return <div className="p-4 bg-yellow-100 text-yellow-700 rounded">Grup bulunamadı</div>;
  }
  
  return (
    <div>
      {/* Başarı mesajı */}
      {showSaveSuccess && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>Değişiklikler kaydedildi!</p>
          </div>
        </div>
      )}
      
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{groupName}</h2>
            <p className="text-sm text-gray-500">Grup bilgilerini düzenleyin</p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleUpdateGroup}
          >
            Kaydet
          </button>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
      </div>
      
      {/* Tab Menüsü */}
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 ${activeTab === 'participants' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => handleTabChange('participants')}
        >
          Katılımcılar
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'dayType' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => handleTabChange('dayType')}
        >
          Gün Türü
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'draw' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => handleTabChange('draw')}
        >
          Kura Çekimi
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'schedule' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => handleTabChange('schedule')}
        >
          Aylık Program
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => handleTabChange('history')}
        >
          Geçmiş
        </button>
      </div>
      
      {/* İçerik */}
      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === 'participants' && <ParticipantsList groupId={groupId} />}
        {activeTab === 'dayType' && (
          <DayTypeSelector groupId={groupId} />
        )}
        {activeTab === 'draw' && <DrawOrder groupId={groupId} />}
        {activeTab === 'schedule' && <ScheduleList groupId={groupId} />}
        {activeTab === 'history' && <History groupId={groupId} />}
      </div>
    </div>
  );
};

export default GroupManager;