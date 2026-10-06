import { useState } from 'react';
import './App.css';
import { PhaserGame } from './game/PhaserGame';
import { DialogueBox } from './ui/DialogueBox';
import { Notebook } from './ui/Notebook';

function App() {
    const [collectedEvidence, setCollectedEvidence] = useState([]);

    // Hàm thêm vật chứng vào sổ tay (đảm bảo không bị trùng)
    const handleEvidenceCollected = (evidence) => {
        setCollectedEvidence((prev) => {
            if (prev.find(e => e.id === evidence.id)) return prev; // Nếu có rồi thì bỏ qua
            return [...prev, evidence];
        });
    };

    return (
        <div style={{ position: 'relative', width: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            {/* 1. LỚP REACT UI (Nằm đè lên trên Game) */}
            <Notebook collectedEvidence={collectedEvidence} />
            <DialogueBox onEvidenceCollected={handleEvidenceCollected} />

            {/* 2. LỚP PHASER GAME (Nằm bên dưới) */}
            <PhaserGame />
        </div>
    );
}

export default App;
