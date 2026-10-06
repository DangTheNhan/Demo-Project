import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './config';

export const PhaserGame = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        // Tránh việc Phaser khởi tạo 2 lần trong Strict Mode của React 18+
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game(config);
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    // Thẻ div chứa game
    return <div id="phaser-game-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}></div>;
};
