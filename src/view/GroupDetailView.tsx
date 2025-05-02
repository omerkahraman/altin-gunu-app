import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { updateGroup } from '../features/groups/groupsSlice';
import ParticipantsList from '../components/ParticipantsList';
import DayTypeSelector from '../components/DayTypeSelector';
import DrawOrder from '../components/DrawOrder';
import ScheduleList from '../components/ScheduleList';
import History from '../components/History';

interface GroupDetailViewProps {
  groupId: string;
}

const GroupDetailView: React.FC<GroupDetailViewProps> = ({ groupId }) => {
  const dispatch = useDispatch();
  
  // Group bilgisini Redux store'dan al
  const group = useSelector((state: RootState) => 
    state.groups.list.find(g => g.id === groupId)
  );
  
  const [groupName, setGroupName] = useState(group?.name || '');
  const [activeTab, setActiveTab] = useState<string>('participants');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Grup değiştiğinde form alanlarını güncelle
  useEffect(() => {
    if (group) {
      setGroupName(group.name);
    }
  }, [group]);
  
  // Grup bilgilerini güncelleme işlemi
  const handleUpdateGroup = () => {
    if (!group || groupName.trim() === '') return;
    
    const updatedGroup = {
      ...group,
      name: groupName.trim()
    };
    
    dispatch(updateGroup(updatedGroup));
    showSuccessMessage();
  };
  
  // Başarı mesajını göster
  const showSuccessMessage = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };
  
  // Tab değiştirme işlemi
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };
  
  // Grup bulunamazsa hata mesajı
  if (!group) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <div className="flex">
          <div className="py-1">
            <svg className="w-6 h-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Grup Bulunamadı</p>
            <p className="text-sm">Seçilen grup mevcut değil veya silinmiş olabilir.</p>
          </div>
        </div>
      </div>
    );
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
      
      {/* Grup Bilgileri Formu */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{groupName}</h2>
            <p className="text-sm text-gray-500">Grup bilgilerini düzenleyin</p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
            onClick={handleUpdateGroup}
          >
            Kaydet
          </button>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı</label>
          <input
            type="text"
            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Grup adı giriniz"
          />
        </div>
      </div>
      
      {/* Tab Menüsü */}
      <div className="flex border-b mb-4 overflow-x-auto">
        <button 
          className={`px-4 py-2 ${activeTab === 'participants' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('participants')}
        >
          Katılımcılar
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'dayType' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('dayType')}
        >
          Gün Türü
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'draw' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('draw')}
        >
          Kura Çekimi
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'schedule' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('schedule')}
        >
          Aylık Program
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('history')}
        >
          Geçmiş
        </button>
      </div>
      
      {/* İçerik */}
      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === 'participants' && <ParticipantsList groupId={groupId} />}
        {activeTab === 'dayType' && <DayTypeSelector groupId={groupId} />}
        {activeTab === 'draw' && <DrawOrder groupId={groupId} />}
        {activeTab === 'schedule' && <ScheduleList groupId={groupId} />}
        {activeTab === 'history' && <History groupId={groupId} />}
      </div>
    </div>
  );
};

export default GroupDetailView;