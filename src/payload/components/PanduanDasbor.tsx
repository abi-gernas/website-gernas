/**
 * Panel panduan singkat di beranda dasbor.
 *
 * Ditujukan untuk tim konten yang baru pertama kali memakai Payload: tanpa ini
 * halaman pertama yang mereka lihat hanya deretan kartu koleksi, tanpa
 * keterangan mana yang disunting sehari-hari, mana yang berdampak ke banyak
 * halaman sekaligus, dan bagaimana urutan kerja yang aman.
 *
 * Server component — tidak ada interaksi di dalamnya, jadi tidak perlu
 * dikirim ke browser. Warna memakai variabel tema Payload agar ikut berubah
 * saat staf memilih mode gelap.
 */

const kotak: React.CSSProperties = {
  background: "var(--theme-elevation-50)",
  border: "1px solid var(--theme-elevation-100)",
  borderRadius: "6px",
  padding: "1.25rem 1.5rem",
  marginBottom: "2rem",
};

const judul: React.CSSProperties = {
  margin: "0 0 0.75rem",
  fontSize: "1.05rem",
  fontWeight: 700,
};

const daftar: React.CSSProperties = {
  margin: 0,
  paddingLeft: "1.15rem",
  lineHeight: 1.65,
};

const sorot: React.CSSProperties = {
  marginTop: "1rem",
  paddingTop: "0.85rem",
  borderTop: "1px solid var(--theme-elevation-100)",
  fontSize: "0.9rem",
  color: "var(--theme-elevation-600)",
};

export const PanduanDasbor = () => (
  <div style={kotak}>
    <h2 style={judul}>Selamat datang di dasbor Gernas Tastaka</h2>

    <ul style={daftar}>
      <li>
        <strong>Konten</strong> — yang disunting sehari-hari. <em>Halaman</em>{" "}
        disusun dari blok: tekan “Tambah Blok”, pilih dari gambar contohnya,
        lalu seret untuk mengubah urutan dari atas ke bawah. <em>Artikel</em>{" "}
        adalah berita, yang otomatis muncul di blok “Berita Terbaru”.
      </li>
      <li>
        <strong>Data Situs</strong> — daftar yang dipakai berulang: Penggerak,
        Mitra, Video, Modul Pelatihan. Isinya tidak diketik di dalam halaman,
        melainkan diambil dari sini. Karena itu mengubah satu data di sini ikut
        mengubah <em>semua</em> halaman yang menampilkannya.
      </li>
      <li>
        <strong>Pengaturan</strong> — data kontak, media sosial, dan pengalihan
        URL. Jarang disentuh.
      </li>
    </ul>

    <p style={sorot}>
      Urutan kerja yang aman: simpan sebagai <strong>draf</strong> dulu → cek
      lewat tombol <strong>Pratinjau</strong> (jendela di samping ikut berubah
      tiap kali disimpan) → baru tekan <strong>Terbitkan</strong>. Selama masih
      draf, pengunjung situs belum bisa melihatnya.
    </p>
  </div>
);
