// Array utama untuk menyimpan data struktur: [ { namaGaleri, whatsapp, produk: [...] } ]
let databaseGaleri = [];

document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Ambil data input
    const namaGaleri = document.getElementById('namaGaleri').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    
    const namaProduk = document.getElementById('namaProduk').value.trim();
    const kategori = document.getElementById('kategori').value;
    const harga = document.getElementById('harga').value;
    const ukuran = document.getElementById('ukuran').value || '-';
    const pewarnaan = document.getElementById('pewarnaan').value;
    const kodeFoto = document.getElementById('kodeFoto').value || '-';
    const maknaMotif = document.getElementById('maknaMotif').value || '-';

    // Buat objek produk tunggal
    const produkBaru = {
        idProduk: Date.now(),
        namaProduk,
        kategori,
        harga: parseFloat(harga),
        ukuran,
        pewarnaan,
        kodeFoto,
        maknaMotif
    };

    // Cek apakah galeri tersebut sudah terdaftar di database lokal browser kita
    let galeriTersedia = databaseGaleri.find(g => g.namaGaleri.toLowerCase() === namaGaleri.toLowerCase());

    if (galeriTersedia) {
        // Jika galeri sudah ada, langsung masukkan sampel produk ke dalam array produknya
        galeriTersedia.produk.push(produkBaru);
    } else {
        // Jika galeri belum ada, buat objek galeri baru beserta array produk pertama
        databaseGaleri.push({
            idGaleri: 'galeri-' + Date.now(),
            namaGaleri,
            whatsapp,
            produk: [produkBaru]
        });
    }

    // Refresh visual tabel database
    renderDatabase();

    // Reset input produk saja agar mempermudah tim memasukkan sampel ke-2, ke-3 dst pada galeri yang sama
    document.getElementById('namaProduk').value = '';
    document.getElementById('harga').value = '';
    document.getElementById('ukuran').value = '';
    document.getElementById('kodeFoto').value = '';
    document.getElementById('maknaMotif').value = '';
});

// Fungsi untuk merender database multi-produk ke halaman
function renderDatabase() {
    const container = document.getElementById('databaseOutput');
    container.innerHTML = ''; // bersihkan kontainer

    if (databaseGaleri.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#999; border: 1px dashed #decbb7; padding: 20px;">Belum ada galeri atau sampel kain yang direkam.</p>`;
        return;
    }

    // Iterasi setiap galeri
    databaseGaleri.forEach((galeri) => {
        const galeriCard = document.createElement('div');
        galeriCard.className = 'galeri-card';

        // Buat Kepala Data Galeri
        let htmlContent = `
            <div class="galeri-header">
                <h3>🏪 ${galeri.namaGaleri} (WA: ${galeri.whatsapp})</h3>
                <button class="no-print" onclick="hapusGaleri('${galeri.idGaleri}')" style="background:#d9534f; color:white; border:none; padding:4px 10px; border-radius:3px; font-size:11px; cursor:pointer;">Hapus Toko</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nama Produk / Sampel</th>
                        <th>Kategori</th>
                        <th>Harga Jual</th>
                        <th>Ukuran</th>
                        <th>Sistem Pewarnaan</th>
                        <th>Filosofi & Makna Motif</th>
                        <th>Kode Aset Foto</th>
                        <th class="no-print">Aksi</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Iterasi semua sampel produk di dalam galeri ini
        galeri.produk.forEach((prod) => {
            const formatRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(prod.harga);
            
            htmlContent += `
                <tr>
                    <td><strong>${prod.namaProduk}</strong></td>
                    <td>${prod.kategori}</td>
                    <td><span style="color:#27ae60; font-weight:bold;">${formatRupiah}</span></td>
                    <td>${prod.ukuran}</td>
                    <td>${prod.pewarnaan}</td>
                    <td>${prod.maknaMotif}</td>
                    <td><code>${prod.kodeFoto}</code></td>
                    <td class="no-print">
                        <button onclick="hapusProduk('${galeri.idGaleri}', ${prod.idProduk})" style="background:none; border:none; color:#d9534f; cursor:pointer; text-decoration:underline; font-size:12px;">Hapus Kain</button>
                    </td>
                </tr>
            `;
        });

        htmlContent += `
                </tbody>
            </table>
        `;

        galeriCard.innerHTML = htmlContent;
        container.appendChild(galeriCard);
    });
}

// Fungsi hapus satu galeri penuh
function hapusGaleri(idGaleri) {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh data galeri ini beserta semua sampel kainnya?")) {
        databaseGaleri = databaseGaleri.filter(g => g.idGaleri !== idGaleri);
        renderDatabase();
    }
}

// Fungsi hapus sampel produk tertentu di dalam galeri tertentu
function hapusProduk(idGaleri, idProduk) {
    let galeri = databaseGaleri.find(g => g.idGaleri === idGaleri);
    if (galeri) {
        galeri.produk = galeri.produk.filter(p => p.idProduk !== idProduk);
        // Jika produk di galeri tersebut habis/kosong, hapus galerinya juga dari database
        if (galeri.produk.length === 0) {
            databaseGaleri = databaseGaleri.filter(g => g.idGaleri !== idGaleri);
        }
        renderDatabase();
    }
}

// Fungsi cetak PDF otomatis
function exportKePDF() {
    if (databaseGaleri.length === 0) {
        alert("Gagal mencetak! Database kosong. Sila masukkan data lapangan terlebih dahulu.");
        return;
    }
    window.print();
}

// Panggil render awal
renderDatabase();