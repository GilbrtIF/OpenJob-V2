# Studi Kasus: OpenJob RESTful API (Kompilasi Versi 1 & 2)

Sebagai seorang *Back-End Developer* di sebuah perusahaan multinasional, Anda ditugaskan untuk membangun **OpenJob**, sebuah aplikasi internal untuk merekrut calon karyawan. Proyek ini dibagi menjadi dua fase utama:
- **Versi 1 (Fondasi):** Membangun RESTful API dasar dengan PostgreSQL, sistem autentikasi, dan otorisasi.
- **Versi 2 (Peningkatan Performa & Fitur):** Menambahkan fitur unggah CV (PDF), mengimplementasikan *caching* dengan Redis, dan memproses *background task* menggunakan RabbitMQ.

---

## 📋 Pengantar Penilaian
Setiap kriteria memiliki bobot nilai **0 sampai 4 points (pts)**. Untuk lulus dari submission ini, Anda harus mendapatkan **minimal 2 points (Basic)** pada setiap kriteria. Submission akan ditolak jika terdapat kriteria bernilai **0 points**.

Nilai Akhir = Total Points / Jumlah Kriteria

| Nilai Akhir | Nilai Huruf | Level of Mastery | Makna Nilai |
| :--- | :--- | :--- | :--- |
| < 1 | E (Rejected) | Tidak Lulus | Belum memenuhi kompetensi minimal. |
| 1 - < 2 | D | Below Basic (Kurang) | Memenuhi kompetensi minimal, ada area peningkatan. |
| 2 - < 3 | C | Basic (Cukup) | Memenuhi kompetensi minimal dari *learning objective*. |
| 3 - < 4 | B | Skilled (Mahir) | Memenuhi semua kompetensi dengan baik. |
| 4 | A | Advanced (Tingkat Lanjut) | Memenuhi semua kompetensi dengan sangat baik. |

---

## 🚀 FASE 1: Fondasi dan Keamanan (Versi 1)

### 🎯 Kriteria 1: Database PostgreSQL & Validasi
RESTful API harus menyimpan data di database PostgreSQL dan memiliki struktur yang baik.

* **❌ Reject (0 pts):** Tidak menggunakan database, menggunakan selain PostgreSQL, atau konfigurasi gagal.
* **⭐️ Basic (2 pts):**
  * Data disimpan di PostgreSQL.
  * Menggunakan `node-pg-migrate` untuk mengelola struktur tabel (wajib ada *timestamp* otomatis).
  * Kredensial DB dan Server menggunakan file `.env` (tidak *hardcoded*).
  * Dapat dijalankan dengan `npm run start:dev`.
  * Menggunakan library Data Validation (Joi/Yup/Zod).
* **⭐️⭐️ Skilled (3 pts):** Memenuhi *Basic* + Pengujian wajib Postman sukses + Ada *middleware error handling* & validasi Joi + Minimal 1 *unique constraint* (misal: email di tabel users).
* **⭐️⭐️⭐️ Advanced (4 pts):** Memenuhi *Skilled* + Normalisasi DB & relasi tabel baik + Melampirkan ERD (`ERD-OpenJob-versi-1.jpg/png`) + Implementasi *query parameter* pada `GET /jobs` (`?title` & `?company-name`) + Semua pengujian Postman sukses.

### 🎯 Kriteria 2: Autentikasi & Otorisasi (Express.js)
Menerapkan sistem keamanan untuk *Public* dan *Protected endpoints*.

* **❌ Reject (0 pts):** Tidak ada autentikasi atau menggunakan *sessions/cookies*.
* **⭐️ Basic (2 pts):** Terdapat implementasi endpoints publik (GET all/detail untuk companies, categories, jobs; POST register/login/refresh) dan *protected endpoints* (POST/PUT/DELETE, profile, applications, bookmarks). JWT payload mengandung `id` user.
* **⭐️⭐️ Skilled (3 pts):** Memenuhi *Basic* + Pengujian wajib Postman sukses + *Middleware auth* + Protected routes berfungsi (`/profile`, `/profile/applications`, `/profile/bookmarks`).
* **⭐️⭐️⭐️ Advanced (4 pts):** Memenuhi *Skilled* + *Secret key* menggunakan `ACCESS_TOKEN_KEY` & `REFRESH_TOKEN_KEY` di `.env` + *Access Token* berlaku hingga 3 jam + Semua pengujian Postman sukses.

---

## 🚀 FASE 2: Peningkatan Performa dan Fitur (Versi 2)

### 🎯 Kriteria 3: Mengunggah Berkas Dokumen PDF
API dapat mengelola unggahan berkas CV/Resume dalam format PDF.

* **❌ Reject (0 pts):** Tidak dapat mengunggah berkas PDF.
* **⭐️ Basic (2 pts):** Berhasil unggah PDF + Validasi ukuran (maks 5 MB) + Validasi MIME type (`application/pdf`).
* **⭐️⭐️ Skilled (3 pts):** Memenuhi *Basic* + Pengujian wajib Postman sukses + Menggunakan `multer` + Menyimpan nama berkas di database.
* **⭐️⭐️⭐️ Advanced (4 pts):** Memenuhi *Skilled* + Bisa menampilkan/mengunduh berkas yang diunggah + Semua pengujian Postman sukses.

### 🎯 Kriteria 4: Menerapkan Caching (Redis)
Meningkatkan performa *read* data.

* **❌ Reject (0 pts):** Tidak menerapkan *caching* atau tidak menggunakan Redis.
* **⭐️ Basic (2 pts):** *Caching* diterapkan pada salah satu endpoint detail: `GET /companies/:id`, `GET /users/:id`, atau `GET /applications/:id`.
* **⭐️⭐️ Skilled (3 pts):** Memenuhi *Basic* + Pengujian wajib Postman sukses + *TTL (Time-To-Live)* cache 1 jam + Menggunakan `REDIS_HOST` di `.env`.
* **⭐️⭐️⭐️ Advanced (4 pts):** Memenuhi *Skilled* + Cache di endpoint lain + Mengembalikan custom header `X-Data-Source: cache` + Implementasi **Cache Invalidation**:
  * `CREATE/UPDATE/DELETE` Perusahaan ➔ hapus cache `GET /companies/:id`.
  * `UPDATE` User ➔ hapus cache `GET /users/:id`.
  * `CREATE/UPDATE` Lamaran ➔ hapus cache list lamaran kandidat & perusahaan (serta detail jika update).
  * `CREATE/DELETE` Bookmark ➔ hapus cache `GET /bookmarks`.

### 🎯 Kriteria 5: Message Queue (RabbitMQ)
Mengelola proses pendaftaran lamaran baru secara *asynchronous*.

* **❌ Reject (0 pts):** Tidak ada RabbitMQ atau menggunakan MQ lain.
* **⭐️ Basic (2 pts):** Mengirim pesan (hanya `application_id`) ke RabbitMQ saat pelamar membuat lamaran + Ada 1 program *consumer* asynchronous.
* **⭐️⭐️ Skilled (3 pts):** Memenuhi *Basic* + Pengujian wajib Postman sukses + Kredensial di `.env` (`RABBITMQ_HOST`, dll).
* **⭐️⭐️⭐️ Advanced (4 pts):** Memenuhi *Skilled* + *Consumer* mengirim email via Nodemailer + Email dikirim ke **pemilik lowongan (job owner)** bukan pelamar + Konten email (nama pelamar, email pelamar, tanggal) diambil dari DB + Menggunakan kredensial `MAIL_*` di `.env`.

---

## 🔑 Konfigurasi Environment Variables (.env)
Berikut adalah daftar lengkap *environment variables* yang wajib digunakan pada proyek ini:

```env
# Server Config
HOST=localhost
PORT=5000

# PostgreSQL Config
PGUSER=
PGPASSWORD=
PGDATABASE=
PGHOST=
PGPORT=

# JWT Config
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=

# Redis Config
REDIS_HOST=

# RabbitMQ Config
RABBITMQ_HOST=
RABBITMQ_PORT=
RABBITMQ_USER=
RABBITMQ_PASSWORD=

# Mailer Config (Nodemailer)
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
```

---

## ⚠️ Syarat Penolakan (Rejected)
Submission Anda akan langsung **DITOLAK** apabila:
1. Terdapat kriteria bernilai 0 (Basic tidak terpenuhi).
2. Ketentuan berkas submission tidak sesuai.
3. Aplikasi Node.js tidak dapat dijalankan di versi **Node.js LTS terbaru (v22)**.
4. Menggunakan bahasa pemrograman/teknologi selain **JavaScript** dan **Node.js**.
5. Menggunakan framework Node.js selain **Express.js**.
6. Melakukan kecurangan seperti tindakan **plagiasi**.