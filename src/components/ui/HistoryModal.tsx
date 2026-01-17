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
    // UPDATED: Variable background for overlay
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      
      {/* UPDATED: Variable bg for modal card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--text-secondary)]/20 rounded-xl w-full max-w-md p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Result History</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-2">✕</button>
        </div>

        {history.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-center py-8">No tests completed yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--text-secondary)]/20">
            <table className="w-full text-sm text-left text-[var(--text-secondary)]">
              <thead className="text-xs uppercase bg-[var(--text-secondary)]/10 text-[var(--text-primary)]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3 text-right">WPM</th>
                  <th className="px-4 py-3 text-right">Acc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--text-secondary)]/20">
                {history.slice().reverse().slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-[var(--text-secondary)]/5">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 capitalize">{item.mode.replace('timed-', '')}s</td>
                    <td className="px-4 py-3 text-right text-[var(--text-primary)] font-bold">{item.wpm}</td>
                    <td className={`px-4 py-3 text-right font-medium ${item.accuracy === 100 ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{item.accuracy}%</td>
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