import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { 
  addGroup,
  Group 
} from '../features/groups/groupsSlice';
import { 
  addDefaultDayTypes 
} from '../features/dayTypes/dayTypesSlice';
import GroupsList from '../components/GroupsList';

const GroupsView: React.FC = () => {
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  
  const groups = useSelector((state: RootState) => state.groups.list);
  const dispatch = useDispatch();
  
  const handleCreateGroup = () => {
    if (newGroupName.trim() === '') {
      alert('Lütfen grup adı girin');
      return;
    }
    
    const newGroupId = Date.now().toString();
    
    const newGroup: Group = {
      id: newGroupId,
      name: newGroupName.trim(),
      createdAt: new Date().toISOString()
    };
    
    dispatch(addGroup(newGroup));
    dispatch(addDefaultDayTypes(newGroupId));
    
    setNewGroupName('');
    setShowNewGroupForm(false);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Altın Günü Grupları</h2>
        {!showNewGroupForm && (
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowNewGroupForm(true)}
          >
            Yeni Grup Oluştur
          </button>
        )}
      </div>
      
      {showNewGroupForm ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Yeni Altın Günü Grubu</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Örn: Aile Altın Günü, Komşular Altın Günü"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={() => setShowNewGroupForm(false)}
            >
              İptal
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleCreateGroup}
            >
              Grubu Oluştur
            </button>
          </div>
        </div>
      ) : null}
      
      {/* GroupsList bileşenini kullan */}
      <GroupsList groups={groups} />
    </div>
  );
};

export default GroupsView;