SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database Penghuni
CREATE TABLE `penghunis` (
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prodi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `angkatan` int NOT NULL,
  `asalDaerah` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noHp` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- isi data for table `penghunis`
--

INSERT INTO `penghunis` (`id`, `nama`, `prodi`, `angkatan`, `asalDaerah`, `noHp`, `created_at`, `updated_at`) VALUES
(1, 'Ditta', 'TPL', 59, 'Jakarta', '0896890007', '2025-05-02 21:25:49', '2025-05-02 21:25:49'),
(3, 'Disty', 'JMP', 60, 'Bekasi', '08788900678', '2025-05-02 21:26:20', '2025-05-02 21:26:20'),
(4, 'Rina', 'GZI', 61, 'Tangerang', '086896345', '2025-05-02 21:26:50', '2025-05-02 21:26:50'),
(5, 'Jaka', 'ANKIM', 59, 'Bandung', '04567899', '2025-05-02 21:27:14', '2025-05-02 21:27:14');
--
-- Indexes for table `penghunis`
--
ALTER TABLE `penghunis`
  ADD PRIMARY KEY (`id`);
--
-- AUTO_INCREMENT for table `penghunis`
--
ALTER TABLE `penghunis`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;


USE my_app_db;

-- Membuat tabel untuk menyimpan data statistik bulanan
CREATE TABLE IF NOT EXISTS monthly_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month VARCHAR(10) NOT NULL,
    month_number INT NOT NULL,
    year INT NOT NULL,
    sales DECIMAL(10, 2) NOT NULL,
    revenue DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_month_year (month_number, year)
);

-- Membuat tabel untuk statistik triwulanan
CREATE TABLE IF NOT EXISTS quarterly_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quarter VARCHAR(10) NOT NULL,
    year INT NOT NULL,
    sales DECIMAL(10, 2) NOT NULL,
    revenue DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_quarter_year (quarter, year)
);

-- Membuat tabel untuk statistik tahunan
CREATE TABLE IF NOT EXISTS yearly_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year INT NOT NULL,
    sales DECIMAL(10, 2) NOT NULL,
    revenue DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_year (year)
);

-- Memasukkan data contoh untuk statistik bulanan 2024
INSERT INTO monthly_statistics (month, month_number, year, sales, revenue) VALUES
('Jan', 1, 2024, 180, 40),
('Feb', 2, 2024, 190, 30),
('Mar', 3, 2024, 170, 50),
('Apr', 4, 2024, 160, 40),
('May', 5, 2024, 175, 55),
('Jun', 6, 2024, 165, 40),
('Jul', 7, 2024, 170, 70),
('Aug', 8, 2024, 205, 100),
('Sep', 9, 2024, 230, 110),
('Oct', 10, 2024, 210, 120),
('Nov', 11, 2024, 240, 150),
('Dec', 12, 2024, 235, 140);

-- Memasukkan data contoh untuk statistik triwulanan 2024
INSERT INTO quarterly_statistics (quarter, year, sales, revenue) VALUES
('Q1', 2024, 540, 120),
('Q2', 2024, 500, 135),
('Q3', 2024, 605, 280),
('Q4', 2024, 685, 410);

-- Memasukkan data contoh untuk statistik tahunan
INSERT INTO yearly_statistics (year, sales, revenue) VALUES
(2022, 1800, 800),
(2023, 2100, 950),
(2024, 2330, 945);