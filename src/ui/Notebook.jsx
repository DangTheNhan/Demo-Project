import { useState } from 'react';

export const Notebook = ({ collectedEvidence }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
            {/* Nút mở Sổ tay */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
                    background: '#2c3e50', color: '#ecf0f1', border: '2px solid #ecf0f1',
                    borderRadius: '5px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                📓 SỔ TAY ({collectedEvidence.length})
            </button>

            {/* Giao diện Sổ tay */}
            {isOpen && (
                <div style={{
                    marginTop: '10px', background: '#ecf0f1', color: '#2c3e50',
                    width: '300px', height: '400px', borderRadius: '5px', border: '2px solid #bdc3c7',
                    padding: '15px', overflowY: 'auto', boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ borderBottom: '2px solid #34495e', paddingBottom: '10px', marginTop: 0 }}>
                        Bằng chứng (Evidence)
                    </h2>
                    
                    {collectedEvidence.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>Chưa thu thập được gì...</p>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {collectedEvidence.map((ev, index) => (
                                <li key={index} style={{
                                    background: 'white', padding: '10px', margin: '10px 0',
                                    borderRadius: '5px', borderLeft: '4px solid #e74c3c',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <strong style={{ display: 'block', fontSize: '16px' }}>{ev.name}</strong>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
