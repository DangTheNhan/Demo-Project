import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.score = 0;
    }

    preload() {
        // Tải hình ảnh
        this.load.image('bg', '/bg.png');
        this.load.image('basket', '/basket.png');
        this.load.image('apple', '/apple.png');
        this.load.image('money', '/money.png');

        // Tải âm thanh
        this.load.audio('bgMusic', '/bgMusic.mp3');
        this.load.audio('coinSound', '/coin.mp3');
    }

    create() {
        // --- Âm thanh ---
        // Phát nhạc nền lặp lại
        this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
        this.bgMusic.play();

        // Âm thanh ăn điểm
        this.coinSound = this.sound.add('coinSound');

        // --- Hình ảnh nền ---
        // Thêm hình nền ở giữa màn hình (400, 300)
        let bg = this.add.image(400, 300, 'bg');
        // Phóng to/thu nhỏ ảnh nền cho vừa màn hình 800x600 (nếu cần)
        bg.setDisplaySize(800, 600);

        // --- Người chơi (Cái rổ) ---
        // Đặt rổ ở dưới cùng màn hình
        this.player = this.physics.add.sprite(400, 550, 'basket');
        this.player.setCollideWorldBounds(true); // Không cho đi ra ngoài màn hình
        this.player.body.allowGravity = false; // Tắt trọng lực để rổ không rơi xuống
        
        // Chỉnh kích thước collider của rổ nếu ảnh quá to
        this.player.setDisplaySize(100, 100); 

        // --- Các phím điều khiển ---
        this.cursors = this.input.keyboard.createCursorKeys();

        // --- Vật phẩm (Táo & Tiền) rơi xuống ---
        this.items = this.physics.add.group();

        // Tạo sự kiện lặp lại: Cứ 1 giây (1000ms) sẽ rơi ra 1 vật phẩm
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        });

        // --- Điểm số ---
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff', fontStyle: 'bold' });

        // --- Xử lý va chạm ---
        // Khi rổ chạm vào vật phẩm
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
    }

    update() {
        // --- Điều khiển rổ ---
        // Tốc độ di chuyển của rổ
        const speed = 400; 

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0); // Đứng im khi không bấm phím
        }

        // --- Dọn dẹp vật phẩm rơi ra ngoài màn hình ---
        // Để game không bị lag khi có quá nhiều vật phẩm ngoài màn hình
        const children = this.items.getChildren();
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child && child.y > 650) {
                child.destroy();
            }
        }
    }

    // Hàm tạo vật phẩm rơi ngẫu nhiên
    spawnItem() {
        // Random vị trí X từ 50 đến 750
        const x = Phaser.Math.Between(50, 750);
        
        // Random loại vật phẩm: Táo hoặc Tiền (có thể tăng tỉ lệ nếu muốn)
        const itemType = Phaser.Math.Between(0, 1) === 0 ? 'apple' : 'money';
        
        // Tạo vật phẩm ở tọa độ (x, 0)
        const item = this.items.create(x, 0, itemType);
        
        // Tốc độ rơi (Gravity)
        item.setGravityY(Phaser.Math.Between(50, 150)); 
        
        // Scale vật phẩm nếu ảnh to
        item.setDisplaySize(50, 50);
    }

    // Hàm xử lý khi hứng được vật phẩm
    collectItem(player, item) {
        // Xóa vật phẩm
        item.destroy();

        // Phát âm thanh
        this.coinSound.play();

        // Cộng điểm (ví dụ: táo 10 điểm, tiền 20 điểm)
        if (item.texture.key === 'apple') {
            this.score += 10;
        } else {
            this.score += 20;
        }

        // Cập nhật text hiển thị
        this.scoreText.setText('Score: ' + this.score);
    }
}
