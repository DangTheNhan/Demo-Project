import Phaser from 'phaser';
import { InvestigationScene } from './scenes/InvestigationScene';

export const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }, // Trọng lực để nhân vật đứng trên sàn
            debug: true // Bật debug để dễ nhìn thấy Hitbox trong quá trình phát triển
        }
    },
    scene: [InvestigationScene]
};
