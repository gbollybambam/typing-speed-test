import React from 'react';

export interface HistoryItem {
  wpm: number;
  accuracy: number;
  date: string;
  mode: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

const HistoryModal = ({ isOpen, onClose, history }: HistoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Result History</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white p-2">✕</button>
        </div>

        {history.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">No tests completed yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <table className="w-full text-sm text-left text-neutral-400">
              <thead className="text-xs uppercase bg-neutral-800 text-neutral-200">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3 text-right">WPM</th>
                  <th className="px-4 py-3 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {history.slice().reverse().slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-neutral-800/50">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 capitalize">{item.mode.replace('timed-', '')}s</td>
                    <td className="px-4 py-3 text-right text-white font-bold">{item.wpm}</td>
                    <td className={`px-4 py-3 text-right font-medium ${item.accuracy === 100 ? 'text-green-500' : 'text-neutral-300'}`}>{item.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;