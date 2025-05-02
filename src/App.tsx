import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import { setActiveGroupId } from './features/groups/groupsSlice';
import GroupsView from './view/GroupsView';
import GroupDetailView from './view/GroupDetailView';

const App: React.FC = () => {
  const activeGroupId = useSelector((state: RootState) => state.groups.activeGroupId);
  const dispatch = useDispatch();

  // Store yapısını başlatmak için 
  useEffect(() => {
    // Burada gerekirse state'i başlatabilirsiniz
    
    // Örnek: Eğer byGroup nesneleri yoksa, bunları başlat
    // dispatch({ type: 'INITIALIZE_STORE' });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Altın Günü Uygulaması</h1>
          {activeGroupId && (
            <button 
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm"
              onClick={() => dispatch(setActiveGroupId(null))}
            >
              Gruplara Dön
            </button>
          )}
        </div>
      </header>
      
      <div className="container mx-auto p-4">
        {!activeGroupId ? (
          <GroupsView />
        ) : (
          <GroupDetailView groupId={activeGroupId} />
        )}
      </div>
    </div>
  );
};  

export default App;