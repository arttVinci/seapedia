package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Simplified structs for seeding
type User struct {
	ID           string `gorm:"primaryKey;column:id"`
	Username     string `gorm:"column:username"`
	Email        string `gorm:"column:email"`
	Password     string `gorm:"column:password"`
	AuthProvider string `gorm:"column:auth_provider"`
	IsAdmin      bool   `gorm:"column:is_admin"`
	CreatedAt    int64  `gorm:"column:created_at"`
	UpdatedAt    int64  `gorm:"column:updated_at"`
}

type UserRole struct {
	ID        string `gorm:"primaryKey;column:id"`
	UserID    string `gorm:"column:user_id"`
	Role      string `gorm:"column:role"`
	CreatedAt int64  `gorm:"column:created_at"`
	UpdatedAt int64  `gorm:"column:updated_at"`
}

type Wallet struct {
	ID      string `gorm:"primaryKey;column:id"`
	UserID  string `gorm:"column:user_id"`
	Balance int    `gorm:"column:balance"`
}

type Category struct {
	ID        string `gorm:"primaryKey;column:id"`
	Name      string `gorm:"column:name"`
	CreatedAt int64  `gorm:"column:created_at"`
	UpdatedAt int64  `gorm:"column:updated_at"`
}

type ProductCategory struct {
	ProductID  string `gorm:"column:product_id"`
	CategoryID string `gorm:"column:category_id"`
}

func (ProductCategory) TableName() string {
	return "product_categories"
}

type Store struct {
	ID          string `gorm:"primaryKey;column:id"`
	UserID      string `gorm:"column:user_id"`
	Name        string `gorm:"column:name"`
	Description string `gorm:"column:description"`
	CreatedAt   int64  `gorm:"column:created_at"`
	UpdatedAt   int64  `gorm:"column:updated_at"`
}

type Product struct {
	ID          string `gorm:"primaryKey;column:id"`
	StoreID     string `gorm:"column:store_id"`
	Name        string `gorm:"column:name"`
	Description string `gorm:"column:description"`
	Price       int64  `gorm:"column:price"`
	Stock       int    `gorm:"column:stock"`
	ImageUrl    string `gorm:"column:image_url"`
	CreatedAt   int64  `gorm:"column:created_at"`
	UpdatedAt   int64  `gorm:"column:updated_at"`
}

func now() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

func main() {
	username := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASS")
    host     := os.Getenv("DB_HOST")
    port     := os.Getenv("DB_PORT")
    dbName   := os.Getenv("DB_NAME")

    // Membuat DSN string
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&tls=true&tidb_skip_isolation_level_check=1", 
        username, password, host, port, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to db: %v", err)
	}

	hash := "$2a$10$513x.ssR.zcvDviY.qiu7ue1wOC1ZbBvN/A2Kw0UNktMCFXgyUqa6" // admin123

	// 1. Categories
	cats := []string{
		"Handphone",
		"Laptop",
		"Apple",
		"Gaming",
		"Fashion",
		"Olahraga",
		"Sepatu",
		"Rumah Tangga",
	}

	categoryIDs := make(map[string]string)
	for _, name := range cats {
		id := uuid.NewString()
		categoryIDs[name] = id
		db.Create(&Category{
			ID:        id,
			Name:      name,
			CreatedAt: now(),
			UpdatedAt: now(),
		})
	}

	// 2. Users (Buyers and Drivers)
	createUser := func(prefix, role string, count int) {
		for i := 1; i <= count; i++ {
			userID := uuid.NewString()
			db.Create(&User{
				ID:           userID,
				Username:     fmt.Sprintf("%s%d", prefix, i),
				Email:        fmt.Sprintf("%s%d@seapedia.com", prefix, i),
				Password:     hash,
				AuthProvider: "local",
				IsAdmin:      false,
				CreatedAt:    now(),
				UpdatedAt:    now(),
			})
			db.Create(&UserRole{
				ID:        uuid.NewString(),
				UserID:    userID,
				Role:      role,
				CreatedAt: now(),
				UpdatedAt: now(),
			})
			db.Create(&Wallet{
				ID:      uuid.NewString(),
				UserID:  userID,
				Balance: 50000000, // 50M
			})
		}
	}
	createUser("buyer", "buyer", 2)
	createUser("driver", "driver", 2)

	// 3. Sellers & Stores
	createStore := func(username, storeName, catName string, products []Product) {
		sellerID := uuid.NewString()
		db.Create(&User{
			ID:           sellerID,
			Username:     username,
			Email:        fmt.Sprintf("%s@seapedia.com", username),
			Password:     hash,
			AuthProvider: "local",
			IsAdmin:      false,
			CreatedAt:    now(),
			UpdatedAt:    now(),
		})
		db.Create(&UserRole{
			ID:        uuid.NewString(),
			UserID:    sellerID,
			Role:      "seller",
			CreatedAt: now(),
			UpdatedAt: now(),
		})
		db.Create(&Wallet{
			ID:      uuid.NewString(),
			UserID:  sellerID,
			Balance: 10000000,
		})

		storeID := uuid.NewString()
		db.Create(&Store{
			ID:          storeID,
			UserID:      sellerID,
			Name:        storeName,
			Description: fmt.Sprintf("Welcome to %s", storeName),
			CreatedAt:   now(),
			UpdatedAt:   now(),
		})

		for _, p := range products {
			p.ID = uuid.NewString()
			p.StoreID = storeID
			p.CreatedAt = now()
			p.UpdatedAt = now()
			db.Create(&p)
			db.Create(&ProductCategory{
				ProductID:  p.ID,
				CategoryID: categoryIDs[catName],
			})
		}
	}

	// 14 Android Products
	androids := []Product{
		{Name: "Poco X6 Pro", Price: 4999000, Stock: 50, ImageUrl: "https://picsum.photos/400/400?random=1", Description: "Poco X6 Pro 5G. Spesifikasi: Layar 6.67 inch AMOLED 120Hz, Chipset MediaTek Dimensity 8300 Ultra, RAM 12GB, Storage 512GB, Kamera Belakang 64MP+8MP+2MP OIS, Baterai 5000mAh dengan Fast Charging 67W. Performa gaming rata kanan untuk semua game masa kini."},
		{Name: "Poco X6", Price: 3999000, Stock: 50, ImageUrl: "https://picsum.photos/400/400?random=2", Description: "Poco X6 5G. Layar CrystalRes 1.5K Flow AMOLED 120Hz. Diotaki Snapdragon 7s Gen 2 yang sangat tangguh. Hadir dengan RAM 12GB dan ROM 256GB. Kamera utama 64MP dengan OIS untuk hasil foto anti-blur. Cocok untuk daily driver dan gaming."},
		{Name: "Samsung Galaxy S24 Ultra", Price: 21999000, Stock: 10, ImageUrl: "https://picsum.photos/400/400?random=3", Description: "Samsung Galaxy S24 Ultra dengan bodi Titanium yang super premium. Spesifikasi: Layar 6.8 inch Dynamic LTPO AMOLED 2X 120Hz, Snapdragon 8 Gen 3 for Galaxy, RAM 12GB, Storage 512GB. Kamera utama 200MP, Telephoto 50MP (5x Optical Zoom). Mendukung penuh Galaxy AI."},
		{Name: "Samsung Galaxy A55", Price: 5999000, Stock: 30, ImageUrl: "https://picsum.photos/400/400?random=4", Description: "Samsung Galaxy A55 5G. Desain premium dengan frame metal dan back cover kaca. Layar Super AMOLED 120Hz 6.6 inch, prosesor Exynos 1480 yang dingin dan hemat daya. Baterai 5000mAh, perlindungan IP67 (tahan air dan debu)."},
		{Name: "Samsung Galaxy A35", Price: 4999000, Stock: 40, ImageUrl: "https://picsum.photos/400/400?random=5", Description: "Samsung Galaxy A35 5G. Pilihan cerdas untuk kelas menengah. Dibekali layar Super AMOLED 6.6 inch 120Hz, Exynos 1380, dan kamera 50MP OIS. Fitur keamanan Samsung Knox Vault menjamin data Anda tetap aman. Desain ikonik khas Samsung."},
		{Name: "Xiaomi 14", Price: 11999000, Stock: 15, ImageUrl: "https://picsum.photos/400/400?random=6", Description: "Xiaomi 14, sang monster compact. Kolaborasi dengan Leica menghasilkan lensa Summilux yang legendaris dengan sensor 50MP Light Hunter 900. Prosesor Snapdragon 8 Gen 3 super kencang, layar 6.36 inch LTPO OLED, HyperOS, dan fast charging 90W."},
		{Name: "Redmi Note 13 Pro+", Price: 5999000, Stock: 25, ImageUrl: "https://picsum.photos/400/400?random=7", Description: "Redmi Note 13 Pro+ 5G. Smartphone flagship-level di harga menengah. Layar melengkung 1.5K AMOLED 120Hz, kamera 200MP OIS, Dimensity 7200 Ultra, RAM 12GB. Fitur tambahan: IP68 (Tahan Air) dan HyperCharge 120W (penuh dalam 19 menit!)."},
		{Name: "Vivo X100 Pro", Price: 13999000, Stock: 5, ImageUrl: "https://picsum.photos/400/400?random=8", Description: "Vivo X100 Pro dengan sistem kamera co-engineered with ZEISS. Chipset Dimensity 9300 pertama di dunia, layar 8T LTPO AMOLED sangat terang. Kamera utama 50MP 1-inch sensor, dipadu lensa telephoto periskop ZEISS APO 50MP."},
		{Name: "Vivo V30 Pro", Price: 8999000, Stock: 20, ImageUrl: "https://picsum.photos/400/400?random=9", Description: "Vivo V30 Pro menghadirkan fitur ZEISS ke lini V-Series. Spesifikasi: Layar 3D Curved AMOLED 120Hz, Dimensity 8200, Aura Light Portrait generasi terbaru. Bodi sangat tipis namun memuat baterai 5000mAh. Kamera depan dan belakang 50MP."},
		{Name: "Oppo Reno 11 Pro", Price: 8999000, Stock: 20, ImageUrl: "https://picsum.photos/400/400?random=10", Description: "Oppo Reno 11 Pro 5G. Sang pakar portrait photography. Dilengkapi lensa telephoto 32MP untuk hasil foto portrait setara DSLR. Desain natural aesthetic yang elegan, layar 3D Curved 120Hz, ColorOS 14, dan SuperVOOC 80W."},
		{Name: "Infinix Zero 30", Price: 3099000, Stock: 100, ImageUrl: "https://picsum.photos/400/400?random=11", Description: "Infinix Zero 30 4G. HP paling terjangkau dengan layar melengkung premium. Spesifikasi: Helio G99, Layar 3D Curved AMOLED 120Hz, Kamera utama 108MP, Kamera Vlogging depan 50MP dengan perekaman video 2K. Sangat cocok untuk konten kreator muda."},
		{Name: "Infinix Note 40", Price: 2799000, Stock: 80, ImageUrl: "https://picsum.photos/400/400?random=12", Description: "Infinix Note 40, revolusi charging di kelas entri. Mendukung MagCharge (Wireless Charging Magnetic) 20W dan Fast Charge kabel 45W. Layar 120Hz AMOLED, Active Halo Design (LED pintar), MediaTek Helio G99 Ultimate, dan Kamera 108MP."},
		{Name: "Tecno Pova 6 Pro", Price: 3299000, Stock: 60, ImageUrl: "https://picsum.photos/400/400?random=13", Description: "Tecno Pova 6 Pro 5G. HP Gaming dengan desain mecha dan Dynamic Light Effect di bodi belakang. Baterai badak 6000mAh dengan pengecasan cepat 70W. Chipset Dimensity 6080 5G, Layar AMOLED 120Hz, dan By-pass Charging untuk main sambil dicas tanpa panas."},
		{Name: "Asus Zenfone 10", Price: 8999000, Stock: 10, ImageUrl: "https://picsum.photos/400/400?random=14", Description: "Asus Zenfone 10 Compact Flagship. Ukuran layar mungil 5.9 inch yang pas digenggam satu tangan, namun dibekali otak monster Snapdragon 8 Gen 2. Kamera 50MP dilengkapi 6-Axis Hybrid Gimbal Stabilizer 2.0 untuk video yang super mulus. Tahan air IP68."},
	}
	createStore("seller_handphone", "Android Central", "Handphone", androids)

	// Windows Laptops
	winLaptops := []Product{
		{Name: "Lenovo Legion Pro 5i", Price: 25999000, Stock: 10, ImageUrl: "https://picsum.photos/400/400?random=15", Description: "Lenovo Legion Pro 5i. Laptop gaming kelas profesional. Spesifikasi: Prosesor Intel Core i7-13700HX (16 Cores, 24 Threads), GPU NVIDIA GeForce RTX 4060 8GB GDDR6 (TGP 140W). Layar 16 inch WQXGA (2560x1600) IPS 165Hz 100% sRGB. RAM 16GB DDR5 4800MHz, SSD 1TB PCIe Gen4. Pendinginan Legion Coldfront 5.0 yang canggih."},
		{Name: "Asus ROG Zephyrus G14", Price: 29999000, Stock: 8, ImageUrl: "https://picsum.photos/400/400?random=16", Description: "Asus ROG Zephyrus G14 (2024). Laptop gaming tertipis dan teringan di kelasnya, berat hanya 1.65 kg. Spesifikasi: AMD Ryzen 9 8945HS, NVIDIA GeForce RTX 4060, RAM 32GB LPDDR5X. Keunggulan utamanya adalah layar ROG Nebula Display OLED 3K 120Hz yang menawarkan warna fantastis. Dilengkapi AniMe Matrix di bagian belakang."},
		{Name: "Advan Workplus", Price: 5999000, Stock: 50, ImageUrl: "https://picsum.photos/400/400?random=17", Description: "Advan Workplus. Laptop lokal dengan value terbaik untuk pekerja dan mahasiswa. Ditenagai prosesor AMD Ryzen 5 6600H (seri performa tinggi) yang kencang, RAM 16GB, dan SSD 512GB. Bodi metal elegan, keyboard backlight, sensor sidik jari, dan layar IPS Full HD 14 inch. Kuat untuk editing tipis dan game esports."},
		{Name: "Acer Nitro V 15", Price: 10999000, Stock: 30, ImageUrl: "https://picsum.photos/400/400?random=18", Description: "Acer Nitro V 15. Pintu masuk ke dunia laptop gaming bertenaga RTX 40 series. Spesifikasi: Intel Core i5-13420H, NVIDIA GeForce RTX 4050 6GB. RAM 8GB DDR5 (bisa diupgrade), SSD 512GB Gen4. Layar 15.6 inch FHD 144Hz IPS. Sistem pendingin dual-fan dengan sirkulasi udara yang baik."},
	}
	createStore("seller_laptop", "WinLaptop Store", "Laptop", winLaptops)

	// Gaming Gear
	gamingGears := []Product{
		{Name: "Razer DeathAdder V3", Price: 1199000, Stock: 40, ImageUrl: "https://picsum.photos/400/400?random=19", Description: "Razer DeathAdder V3 (Wired). Mouse gaming legendaris dengan desain ergonomis sempurna untuk Esports. Berat super ringan 59g, dibekali sensor optik Razer Focus Pro 30K yang sangat akurat di berbagai permukaan, termasuk kaca. Polling rate mendukung hingga 8000Hz (HyperPolling)."},
		{Name: "Logitech G Pro X Superlight", Price: 1899000, Stock: 30, ImageUrl: "https://picsum.photos/400/400?random=20", Description: "Logitech G Pro X Superlight. Mouse wireless favorit pro player sedunia. Berat di bawah 63 gram tanpa perlu desain lubang (honeycomb). Sensor HERO 25K yang presisi dan hemat daya. Teknologi nirkabel LIGHTSPEED dengan latensi nol. Feet mouse PTFE untuk pergerakan mulus."},
		{Name: "SteelSeries Apex Pro TKL", Price: 3199000, Stock: 15, ImageUrl: "https://picsum.photos/400/400?random=21", Description: "SteelSeries Apex Pro TKL (2023). Keyboard gaming tercepat di dunia dengan switch mekanis OmniPoint 2.0 yang dapat disesuaikan aktuasinya (dari 0.2mm hingga 3.8mm). Format Tenkeyless (TKL) memberi ruang ekstra untuk mouse. Layar OLED cerdas tertanam di pojok kanan atas."},
		{Name: "HyperX Cloud III", Price: 1599000, Stock: 25, ImageUrl: "https://picsum.photos/400/400?random=22", Description: "HyperX Cloud III. Headset gaming yang berevolusi dari seri Cloud II yang ikonik. Dilengkapi driver miring 53mm untuk audio presisi. Bantalan telinga memory foam khas HyperX dan headband empuk untuk kenyamanan maraton gaming. Mikrofon 10mm yang diperbarui dengan peredam bising internal."},
	}
	createStore("seller_gaming", "Gamer Paradise", "Gaming", gamingGears)

	// Apple Gear
	appleGears := []Product{
		{Name: "iPhone 15 Pro Max 256GB", Price: 24999000, Stock: 20, ImageUrl: "https://picsum.photos/400/400?random=23", Description: "Apple iPhone 15 Pro Max. Dirancang dengan Titanium sekelas industri dirgantara yang kuat dan ringan. Chip A17 Pro membawa lompatan besar dalam grafis game. Sistem pro-kamera mengagumkan dengan optical zoom 5x terpanjang yang pernah ada di iPhone. Mendukung USB-C berkecepatan tinggi."},
		{Name: "MacBook Pro M3 14 inch", Price: 28999000, Stock: 10, ImageUrl: "https://picsum.photos/400/400?random=24", Description: "Apple MacBook Pro 14-inch dengan Chip M3. Mesin kerja portabel untuk para profesional kreator. Layar Liquid Retina XDR yang luar biasa dengan kecerahan hingga 1000 nits. Memiliki CPU 8-core, GPU 10-core, baterai tahan seharian (hingga 22 jam), dan sistem audio 6 speaker dengan Spatial Audio."},
		{Name: "iPad Air 5 M1", Price: 9999000, Stock: 30, ImageUrl: "https://picsum.photos/400/400?random=25", Description: "Apple iPad Air (Generasi 5). Kekuatan besar dari Apple M1 chip dalam desain tipis dan ringan. Layar Liquid Retina 10.9 inci dengan True Tone, warna luas P3. Kamera depan ultra wide 12MP dengan fitur Center Stage. Kompatibel dengan Apple Pencil (Generasi 2) dan Magic Keyboard."},
		{Name: "AirPods Pro Gen 2", Price: 3999000, Stock: 50, ImageUrl: "https://picsum.photos/400/400?random=26", Description: "Apple AirPods Pro (Generasi ke-2) dengan MagSafe Charging Case (USB-C). Didukung chip H2 untuk peredam kebisingan aktif (ANC) yang 2x lebih cerdas. Mode Transparansi Adaptif secara otomatis meredam suara keras yang menyilaukan telinga. Audio Spasial yang dipersonalisasi."},
	}
	createStore("seller_apple", "iBox KW", "Apple", appleGears)

	// Fashion
	fashions := []Product{
		{Name: "Celana Chino Panjang Pria", Price: 150000, Stock: 200, ImageUrl: "https://picsum.photos/400/400?random=27", Description: "Celana Chino pria dengan potongan slim fit. Terbuat dari bahan katun twill stretch premium yang melar, nyaman digunakan untuk ke kantor maupun bersantai. Jahitan rapi, warna tidak mudah pudar meski dicuci berkali-kali."},
		{Name: "Kemeja Putih Polos Lengan Panjang", Price: 120000, Stock: 300, ImageUrl: "https://picsum.photos/400/400?random=28", Description: "Kemeja putih polos lengan panjang bahan katun rayon yang adem dan menyerap keringat. Potongan slim fit, cocok untuk pakaian kerja, acara formal, atau dipadukan dengan jas. Kain tidak mudah kusut dan mudah disetrika."},
		{Name: "Kemeja Hitam Polos Casual", Price: 120000, Stock: 250, ImageUrl: "https://picsum.photos/400/400?random=29", Description: "Kemeja hitam polos lengan pendek bahan katun poplin premium. Desain casual elegan yang sangat serbaguna untuk gaya harian. Kancing kuat, warna hitam pekat (tidak pudar), dan sangat nyaman dipakai di segala cuaca."},
		{Name: "Jaket Denim Trucker", Price: 180000, Stock: 150, ImageUrl: "https://picsum.photos/400/400?random=30", Description: "Jaket Jeans / Denim model Trucker klasik. Dibuat menggunakan bahan Bajatex Denim 14oz yang kokoh. Proses pencucian bio-wash untuk mendapatkan gradasi warna vintage. Dilengkapi kancing besi anti karat dan saku dada fungsional."},
		{Name: "Kaos Polo Hitam Premium", Price: 95000, Stock: 400, ImageUrl: "https://picsum.photos/400/400?random=31", Description: "Kaos Polo shirt kerah warna hitam pekat bahan Lacoste CVC. Pori-pori kain breathable memastikan sirkulasi udara baik. Kerah kokoh tidak mudah melengkung. Pas untuk gaya smart casual, seragam panitia, atau main golf."},
		{Name: "Jaket Bomber Pilot", Price: 210000, Stock: 100, ImageUrl: "https://picsum.photos/400/400?random=32", Description: "Jaket Bomber bergaya penerbang (Pilot/Aviator) berbahan taslan waterproof anti air. Bagian dalam dilapisi dakron tebal yang menahan angin (windproof) dan menghangatkan tubuh. Ada saku di lengan kiri khas jaket bomber."},
		{Name: "Hoodie Jumper Polos", Price: 135000, Stock: 300, ImageUrl: "https://picsum.photos/400/400?random=33", Description: "Jaket Hoodie Jumper (tanpa resleting) berbahan Cotton Fleece tebal namun lembut di kulit. Bagian dalam berbulu halus yang hangat. Potongan oversized kekinian dengan tali serut di kupluk dan saku kangguru di depan."},
	}
	createStore("seller_fashion", "Style OOTD", "Fashion", fashions)

	// Sports
	sports := []Product{
		{Name: "Sepatu Lari Ortuseight", Price: 350000, Stock: 100, ImageUrl: "https://picsum.photos/400/400?random=34", Description: "Sepatu Running Ortuseight Hyperglide. Menggunakan teknologi Cumulus Foam yang empuk di bagian insole dan outsole rubber untuk grip maksimal. Bagian atas berbahan mesh rajut (knit) bersikulasi udara prima sehingga kaki tidak panas. Cocok untuk lari jarak menengah dan maraton ringan."},
		{Name: "Matras Yoga Anti Slip", Price: 120000, Stock: 200, ImageUrl: "https://picsum.photos/400/400?random=35", Description: "Matras Yoga/Pilates bahan TPE (Thermoplastic Elastomer) ramah lingkungan. Ketebalan 8mm memberikan kenyamanan ekstra untuk tulang belakang dan lutut Anda. Tekstur permukaan double-sided anti-slip menjamin kestabilan pose tersulit sekalipun. Mudah digulung dan termasuk tas jaring."},
		{Name: "Dumbbell Set 10kg", Price: 250000, Stock: 30, ImageUrl: "https://picsum.photos/400/400?random=36", Description: "Set Dumbbell / Barbel multifungsi berat total 10kg. Piringan beban (plate) berlapis lapisan karet (rubber-coated) untuk mencegah kerusakan lantai saat diletakkan. Batang as dilapisi busa anti licin. Beban dapat dibongkar pasang sesuai kebutuhan repetisi otot."},
	}
	createStore("seller_olahraga", "Sportivo", "Olahraga", sports)

	// Sepatu (Replacing Food)
	shoes := []Product{
		{Name: "Sepatu Sneakers Putih Casual", Price: 250000, Stock: 150, ImageUrl: "https://picsum.photos/400/400?random=37", Description: "Sneakers putih klasik bergaya minimalis. Upper berbahan kulit sintetis premium yang mudah dibersihkan. Sol karet TPR anti licin. Sangat mudah di-mix and match dengan segala outfit, mulai dari celana jeans hingga celana bahan pendek."},
		{Name: "Sepatu Lari Running Shoes", Price: 320000, Stock: 120, ImageUrl: "https://picsum.photos/400/400?random=38", Description: "Sepatu lari ringan berteknologi bantalan phylon yang meredam benturan dengan sempurna. Upper mesh sirkulasi udara maksimal, menjaga kaki tetap kering saat berkeringat. Outsole tahan aus untuk aspal maupun treadmill."},
		{Name: "Sepatu Boots Pria Kulit Asli", Price: 650000, Stock: 50, ImageUrl: "https://picsum.photos/400/400?random=39", Description: "Sepatu boots pria berbahan 100% Genuine Leather (kulit sapi asli) model Chukka. Konstruksi kuat dengan jahitan sol tembus ke dalam (stitching). Cocok untuk gaya maskulin sejati, pengendara motor, maupun acara semi-formal."},
		{Name: "Sepatu Loafers Formal Hitam", Price: 400000, Stock: 80, ImageUrl: "https://picsum.photos/400/400?random=40", Description: "Sepatu loafers / pantofel pria tanpa tali (slip on) warna hitam mengkilap. Material action leather dengan insole empuk memory foam. Sangat ideal untuk busana kerja kantoran, rapat, atau menghadiri pesta pernikahan."},
		{Name: "Sepatu Slip-On Kanvas", Price: 150000, Stock: 200, ImageUrl: "https://picsum.photos/400/400?random=41", Description: "Sepatu slip-on santai berbahan kanvas tebal yang sangat praktis dipakai dan dilepas. Sol vulcanized yang direkatkan secara termal, dijamin tidak mudah jebol. Cocok banget buat nongkrong atau jalan-jalan di akhir pekan."},
		{Name: "Sepatu Oxford Klasik Coklat", Price: 450000, Stock: 70, ImageUrl: "https://picsum.photos/400/400?random=42", Description: "Sepatu Oxford pantofel pria bertali dengan warna coklat tua elegan. Motif brogue berlubang artistik pada bagian depan. Memberikan kesan dapper dan gentleman. Outsole fiber berkualitas tinggi yang berbunyi ketika berjalan."},
		{Name: "Sandal Gunung Outdoor", Price: 180000, Stock: 300, ImageUrl: "https://picsum.photos/400/400?random=43", Description: "Sandal gunung pria tangguh untuk kegiatan outdoor, hiking ringan, atau sehari-hari. Strap webbing kuat yang bisa diatur kelonggarannya. Sol bertekstur kasar (lugs) mencengkram medan tanah basah maupun bebatuan dengan aman."},
	}
	createStore("seller_sepatu", "Shoe Center", "Sepatu", shoes)

	// Home
	homes := []Product{
		{Name: "Sprei Katun Jepang 180x200", Price: 150000, Stock: 100, ImageUrl: "https://picsum.photos/400/400?random=44", Description: "Sprei ukuran King (180x200cm) berbahan 100% Katun Jepang import. Tenunan rapat (high thread count) yang sangat halus, dingin, dan tidak berbulu (anti-pilling) setelah dicuci berkali-kali. Paket termasuk 2 sarung bantal dan 2 sarung guling. Terdapat karet di ke-4 sudut sprei."},
		{Name: "Panci Set Stainless 5 in 1", Price: 250000, Stock: 40, ImageUrl: "https://picsum.photos/400/400?random=45", Description: "Set peralatan masak 5-piece terbuat dari Food Grade Stainless Steel 304 tebal antikarat. Dilengkapi tutup kaca tempered transparan dengan lubang uap. Set terdiri dari: Wajan (Wok), Panci Kuah, Panci Susu (Saucepan), dan Spatula set. Gagang ergonomis tahan panas, cocok untuk kompor induksi."},
		{Name: "Sapu Elektrik Otomatis", Price: 180000, Stock: 60, ImageUrl: "https://picsum.photos/400/400?random=46", Description: "Sapu otomatis nirkabel 2 in 1: sapu dan pengepel. Bekerja tanpa listrik colok, cukup ditekan (push sweeper) roda memutar sikat untuk menyapu debu dan rambut langsung ke tangki sampah. Tersedia bantalan pel mikrofiber di bagian bawah untuk sekalian mengepel. Praktis dan hemat energi."},
	}
	createStore("seller_rumah", "Homey Living", "Rumah Tangga", homes)

	fmt.Println("Seeding complete!")
}
