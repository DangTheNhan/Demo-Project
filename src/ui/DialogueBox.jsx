import { useState, useEffect } from 'react';
import { EventBus } from '../game/events/EventBus';
import { EVIDENCE_DATA } from '../data/evidenceData';

export const DialogueBox = ({ onEvidenceCollected }) => {
    const [dialogue, setDialogue] = useState(null);
    const [showMessage, setShowMessage] = useState('');

    useEffect(() => {
        // Lắng nghe sự kiện từ Phaser
        const handleInspect = (evidenceId) => {
            const data = EVIDENCE_DATA[evidenceId];
            if (data) {
                setDialogue(data);
                // Báo cho App.jsx biết để lưu vào Notebook
                onEvidenceCollected(data);
            }
        };

        const handleMessage = (msg) => {
            setShowMessage(msg);
            setTimeout(() => setShowMessage(''), 2000); // Ẩn sau 2 giây
        };

        EventBus.on('INSPECT_ITEM', handleInspect);
        EventBus.on('SHOW_MESSAGE', handleMessage);

        return () => {
            EventBus.off('INSPECT_ITEM', handleInspect);
            EventBus.off('SHOW_MESSAGE', handleMessage);
        };
    }, [onEvidenceCollected]);

    return (
        <>
            {/* Thông báo ngắn (Kiểu: "Hãy đến gần hơn") */}
            {showMessage && (
                <div style={{
                    position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, 0)',
                    background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 20px', borderRadius: '5px'
                }}>
                    {showMessage}
                </div>
            )}

            {/* Hộp thoại Khám nghiệm (Inspect) */}
            {dialogue && (
                <div style={{
                    position: 'absolute', bottom: '20px', left: '10%', width: '80%',
                    background: 'rgba(0, 0, 0, 0.85)', color: 'white', 
                    border: '2px solid #ccc', borderRadius: '8px', padding: '20px',
                    fontFamily: 'monospace', fontSize: '16px', zIndex: 10
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#f39c12' }}>🔍 Phát hiện: {dialogue.name}</h3>
                    <p style={{ margin: 0, lineHeight: '1.5' }}>{dialogue.description}</p>
                    
                    <button 
                        onClick={() => setDialogue(null)}
                        style={{
                            marginTop: '15px', padding: '8px 16px', background: '#3498db', 
                            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}
                    >
                        Đóng
                    </button>
                </div>
            )}
        </>
    );
};
