import Phaser from 'phaser';
import { EventBus } from '../events/EventBus';

export class InvestigationScene extends Phaser.Scene {
    constructor() {
        super('InvestigationScene');
    }

    preload() {
        // Tải các hình ảnh vừa được AI tạo ra
        this.load.image('room_bg', '/room_bg.jpg');
        this.load.image('detective', '/detective.jpg');
        this.load.image('inhaler', '/inhaler.jpg');
        this.load.image('sink', '/sink.jpg');
        this.load.image('trash_can', '/trash_can.jpg');
    }

    create() {
        // --- 1. MÔI TRƯỜNG & SÀN NHÀ ---
        // Thêm background phòng trọ 204
        let bg = this.add.image(400, 300, 'room_bg');
        bg.setDisplaySize(800, 600); // Ép vừa khung hình

        // Sàn nhà trong suốt (Chặn nhân vật không bị rơi)
        this.floor = this.add.rectangle(400, 580, 800, 40, 0x000000, 0); // 0 = trong suốt
        this.physics.add.existing(this.floor, true); 

        // --- 2. CÁC VẬT CHỨNG (TƯƠNG TÁC ĐƯỢC) ---
        // 2a. Bồn rửa mặt (Sink)
        this.createInteractableItem(150, 420, 80, 100, 'EV_WetTowel', 'Bồn rửa', 'sink');
        
        // 2b. Ống hít (Inhaler)
        this.createInteractableItem(500, 460, 40, 40, 'EV_Inhaler', 'Ống hít', 'inhaler');
        
        // 2c. Thùng rác (Trash can)
        this.createInteractableItem(700, 510, 60, 80, 'EV_InhalerBox', 'Thùng rác', 'trash_can');

        // --- 3. NHÂN VẬT CHÍNH (THÁM TỬ) ---
        this.player = this.physics.add.sprite(400, 500, 'detective');
        this.player.setDisplaySize(80, 160); // Thu nhỏ ảnh thám tử lại cho vừa
        this.player.setCollideWorldBounds(true); 
        
        // Xử lý va chạm
        this.physics.add.collider(this.player, this.floor);

        // --- 4. BÀN PHÍM ĐIỀU KHIỂN ---
        this.cursors = this.input.keyboard.createCursorKeys();

        EventBus.emit('SCENE_READY', this);
    }

    update() {
        const speed = 200;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true); // Lật ảnh nhân vật khi quay trái
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false); // Quay lại hướng phải
        } else {
            this.player.setVelocityX(0);
        }
    }

    // --- HÀM HỖ TRỢ TẠO VẬT THỂ TƯƠNG TÁC ---
    createInteractableItem(x, y, width, height, evidenceId, labelText, textureKey) {
        let item;
        if (textureKey) {
            // Nếu có ảnh, dùng Sprite
            item = this.add.sprite(x, y, textureKey);
            item.setDisplaySize(width, height);
        } else {
            // Nếu không có ảnh, dùng vùng chữ nhật vô hình (alpha = 0.3 để dễ nhìn)
            item = this.add.rectangle(x, y, width, height, 0xf1c40f, 0.3);
        }
        
        item.setInteractive({ useHandCursor: true });

        // Text nhãn phía trên
        this.add.text(x - 30, y - height/2 - 20, labelText, { 
            fontSize: '14px', 
            fill: '#fff', 
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 3
        });

        // Xử lý Click
        item.on('pointerdown', () => {
            let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
            
            if (distance < 150) {
                EventBus.emit('INSPECT_ITEM', evidenceId);
            } else {
                EventBus.emit('SHOW_MESSAGE', 'Tôi cần tiến lại gần hơn để xem.');
            }
        });
    }
}
