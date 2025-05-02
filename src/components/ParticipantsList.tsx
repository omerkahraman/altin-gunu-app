import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addParticipant, removeParticipant, Participant } from '../features/participants/participantsSlice';

interface ParticipantsListProps {
    groupId?: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ groupId }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

    // Sadece bu gruba ait katılımcıları filtrele‚‚‚‚

   // Daha güvenli selector kullanımı
   const participants = useSelector((state: RootState) => {
    // byGroup nesnesi var mı kontrol et
    if (!state.participants.byGroup) {
      return [];
    }
    
    // groupId var mı kontrol et
    if (!groupId) {
      return [];
    }
    
    // byGroup[groupId] var mı kontrol et
    return state.participants.byGroup[groupId] || [];
  });

  const dispatch = useDispatch();

  const handleAddParticipant = () => {
    if (name.trim() === '' || !groupId) return;
    
    const newParticipant: Participant = {
      id: Date.now().toString(),
      groupId, // Grup ID'sini ekle
      name: name.trim(),
      phone: phone.trim() || undefined
    };
    
    dispatch(addParticipant(newParticipant));
    setName('');
    setPhone('');
  };

  const handleRemoveParticipant = (id: string) => {
    if(!groupId) return;
    dispatch(removeParticipant({ groupId, participantId: id}));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Katılımcılar</h2>
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="İsim giriniz"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon (İsteğe bağlı)</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="5XX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAddParticipant}
          >
            Ekle
          </button>
        </div>
      </div>
      
      {participants.length === 0 ? (
        <p className="text-gray-500">Henüz katılımcı eklenmedi.</p>
      ) : (
        <ul className="border rounded divide-y">
          {participants.map((participant) => (
            <li key={participant.id} className="p-3 flex justify-between items-center">
              <div>
                <span className="font-medium">{participant.name}</span>
                {participant.phone && <span className="text-sm text-gray-500 ml-2">{participant.phone}</span>}
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveParticipant(participant.id)}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParticipantsList;