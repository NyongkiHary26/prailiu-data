let databaseGaleri = [];

document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const namaGaleri = document.getElementById('namaGaleri').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    
    const namaProduk = document.getElementById('namaProduk').value.trim();
    const kategori = document.getElementById('kategori').value;
    const harga = document.getElementById('harga').value;
    const ukuran = document.getElementById('ukuran').value || '-';
    const pewarnaan = document.getElementById('pewarnaan').value;
    const kodeFoto = document.getElementById('kodeFoto').value || '-';
    const maknaMotif = document.getElementById('maknaMotif').value || '-';

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

    let galeriTersedia = databaseGaleri.find(g => g.namaGaleri.toLowerCase() === namaGaleri.toLowerCase());

    if (galeriTersedia) {
        galeriTersedia.produk.push(produkBaru);
    } else {
        databaseGaleri.push({
            idGaleri: 'galeri-' + Date.now(),
            namaGaleri,
            whatsapp,
            produk: [produkBaru]
        });
    }

    renderDatabase();

    // Reset bidang isian kain agar siap menerima data sampel kain berikutnya
    document.getElementById('namaProduk').value = '';
    document.getElementById('harga').value = '';
    document.getElementById('ukuran').value = '';
    document.getElementById('kodeFoto').value = '';
    document.getElementById('maknaMotif').value = '';
});

function renderDatabase() {
    const container = document.getElementById('databaseOutput');
    container.innerHTML = '';

    if (databaseGaleri.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#666; border: 1px dashed #4d69ff; padding: 20px; border-radius:6px; background:#fff;">Belum ada repositori data kain yang diinput oleh tim lapangan.</p>`;
        return;
    }

    databaseGaleri.forEach((galeri) => {
        const galeriCard = document.createElement('div');
        galeriCard.className = 'galeri-card';

        let htmlContent = `
            <div class="galeri-header">
                <h3>🏪 Rumah Produksi/Galeri: ${galeri.namaGaleri} (WhatsApp Kontak: ${galeri.whatsapp})</h3>
                <button class="no-print" onclick="hapusGaleri('${galeri.idGaleri}')" style="background:#dc3545; color:white; border:none; padding:5px 12px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;">Hapus Galeri</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Spesifikasi Item</th>
                        <th>Kategori</th>
                        <th>Harga Estimasi</th>
                        <th>Dimensi</th>
                        <th>Sistem Pewarnaan</th>
                        <th>Filosofi / Makna Simbolis</th>
                        <th>Arsip File Gambar</th>
                        <th class="no-print">Aksi</th>
                    </tr>
                </thead>
                <tbody>
        `;

        galeri.produk.forEach((prod) => {
            const formatRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(prod.harga);
            
            htmlContent += `
                <tr>
                    <td><strong>${prod.namaProduk}</strong></td>
                    <td>${prod.kategori}</td>
                    <td><span style="color:#001ec6; font-weight:bold;">${formatRupiah}</span></td>
                    <td>${prod.ukuran}</td>
                    <td>${prod.pewarnaan}</td>
                    <td>${prod.maknaMotif}</td>
                    <td><code>${prod.kodeFoto}</code></td>
                    <td class="no-print">
                        <button onclick="hapusProduk('${galeri.idGaleri}', ${prod.idProduk})" style="background:none; border:none; color:#dc3545; cursor:pointer; text-decoration:underline; font-size:12px; font-weight:bold;">Hapus Kain</button>
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

function hapusGaleri(idGaleri) {
    if (confirm("Peringatan, aksi ini akan menghapus galeri beserta seluruh daftar sampel kain di dalamnya!")) {
        databaseGaleri = databaseGaleri.filter(g => g.idGaleri !== idGaleri);
        renderDatabase();
    }
}

function hapusProduk(idGaleri, idProduk) {
    let galeri = databaseGaleri.find(g => g.idGaleri === idGaleri);
    if (galeri) {
        galeri.produk = galeri.produk.filter(p => p.idProduk !== idProduk);
        if (galeri.produk.length === 0) {
            databaseGaleri = databaseGaleri.filter(g => g.idGaleri !== idGaleri);
        }
        renderDatabase();
    }
}

function exportKePDF() {
    if (databaseGaleri.length === 0) {
        alert("Gagal melakukan pencetakan. Harap isi manuskrip data kain terlebih dahulu.");
        return;
    }
    window.print();
}

renderDatabase();
