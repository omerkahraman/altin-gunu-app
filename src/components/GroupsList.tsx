import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveGroupId, deleteGroup } from '../features/groups/groupsSlice';
import { removeGroupParticipants } from '../features/participants/participantsSlice';
import { removeGroupDayTypes } from '../features/dayTypes/dayTypesSlice';
import { removeGroupSchedules } from '../features/schedules/schedulesSlice';
import { removeGroupHistory } from '../features/history/historySlice';
import { Group } from '../features/groups/groupsSlice';

interface GroupsListProps {
  groups: Group[];
}

const GroupsList: React.FC<GroupsListProps> = ({ groups }) => {
  const dispatch = useDispatch();
  
  // Tarih formatını düzenle
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    if (window.confirm(`"${groupName}" grubunu silmek istediğinize emin misiniz?`)) {
      // Önce grubu sil
      dispatch(deleteGroup(groupId));
      
      // Sonra ilgili tüm verileri temizle
      dispatch(removeGroupParticipants(groupId));
      dispatch(removeGroupDayTypes(groupId));
      dispatch(removeGroupSchedules(groupId));
      dispatch(removeGroupHistory(groupId));
    }
  };
  
  if (groups.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow">
        <h3 className="text-xl font-medium text-gray-500 mb-2">Henüz Grup Yok</h3>
        <p className="text-gray-400 mb-4">İlk altın günü grubunuzu oluşturmaya başlayın.</p>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3588/3588614.png" 
          alt="Grup Oluştur" 
          className="w-32 h-32 mx-auto opacity-20"
        />
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map(group => (
        <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium">{group.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Oluşturulma: {formatDate(group.createdAt)}</p>
          </div>
          <div className="bg-gray-50 px-5 py-3 flex justify-between">
            <button
              className="text-red-500 hover:text-red-700 text-sm"
              onClick={() => handleDeleteGroup(group.id, group.name)}
            >
              Sil
            </button>
            <button
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => dispatch(setActiveGroupId(group.id))}
            >
              Yönet
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;