import Phaser from 'phaser';

// Trạm trung chuyển sự kiện toàn cục giữa Phaser và React
export const EventBus = new Phaser.Events.EventEmitter();
