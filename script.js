// ====== PENGATURAN: ganti sesuai usaha kamu ======
const NOMOR_WA = "6285719811942"; // format 62 tanpa 0 di depan

const produk = [
  { id: 1, nama: "Nasi Cokot Ayam Suwir Pedas", icon: "🔴", harga: 6000, desk: "Ayam suwir pedas, gurih berbumbu dengan sensasi pedas menggugah selera.", tag: "Terlaris" },
  { id: 2, nama: "Nasi Cokot Ayam Kecap", icon: "🟤", harga: 5000, desk: "Ayam suwir kecap manis, gurih manis dengan bumbu meresap, pilihan hemat." },
  { id: 3, nama: "Nasi Cokot Ayam Sambal Matah", icon: "🟠", harga: 6000, desk: "Sambal matah segar pedas, aroma serai dan daun jeruk" },
  { id: 6, nama: "Es Teh Manis", icon: "🥤", harga: 3000, desk: "Teman makan yang menyegarkan." }
];

let keranjang = JSON.parse(localStorage.getItem("keranjangNasiCokot") || "{}");
const rp = n => "Rp " + n.toLocaleString("id-ID");
const $ = id => document.getElementById(id);

// Tampilkan menu
$("menuGrid").innerHTML = produk.map(p => `
  <article class="card">
    ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
    <div class="ico" aria-hidden="true">${p.icon}</div>
    <h3>${p.nama}</h3>
    <p>${p.desk}</p>
    <div class="row">
      <span class="harga">${rp(p.harga)}</span>
      <button class="btn-add" onclick="tambah(${p.id})">Tambah</button>
    </div>
  </article>`).join("");

function simpan() { localStorage.setItem("keranjangNasiCokot", JSON.stringify(keranjang)); render(); }
function tambah(id) { keranjang[id] = (keranjang[id] || 0) + 1; simpan(); toast("Ditambahkan ke keranjang"); }
function ubah(id, d) { keranjang[id] += d; if (keranjang[id] <= 0) delete keranjang[id]; simpan(); }

function render() {
  const ids = Object.keys(keranjang);
  let total = 0, jumlah = 0;
  $("items").innerHTML = ids.length ? ids.map(id => {
    const p = produk.find(x => x.id == id), q = keranjang[id];
    total += p.harga * q; jumlah += q;
    return `<div class="item">
      <div>${p.nama}<small>${rp(p.harga)}</small></div>
      <div class="qty">
        <button onclick="ubah(${id},-1)" aria-label="Kurangi">−</button>
        <span>${q}</span>
        <button onclick="ubah(${id},1)" aria-label="Tambah">+</button>
      </div></div>`;
  }).join("") : `<p class="kosong">Keranjang masih kosong. Pilih menu dulu ya.</p>`;
  $("total").textContent = rp(total);
  $("count").textContent = jumlah;
}

function bukaKeranjang(buka) {
  $("panel").classList.toggle("open", buka);
  $("overlay").classList.toggle("open", buka);
}
$("openCart").onclick = () => bukaKeranjang(true);
$("closeCart").onclick = $("overlay").onclick = () => bukaKeranjang(false);

$("checkout").onclick = () => {
  const ids = Object.keys(keranjang);
  if (!ids.length) return toast("Pilih menu dulu");
  const nama = $("nama").value.trim(), alamat = $("alamat").value.trim();
  if (!nama) return toast("Isi nama dulu");
  let total = 0;
  const daftar = ids.map(id => {
    const p = produk.find(x => x.id == id), q = keranjang[id];
    total += p.harga * q;
    return `- ${p.nama} x${q} = ${rp(p.harga * q)}`;
  }).join("\n");
  const pesan = `Halo, saya mau pesan Nasi Cokot:\n${daftar}\n\nTotal: ${rp(total)}\nNama: ${nama}\nAlamat/catatan: ${alamat || "-"}`;
  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`, "_blank");
};

let t;
function toast(msg) {
  const el = $("toast"); el.textContent = msg; el.classList.add("show");
  clearTimeout(t); t = setTimeout(() => el.classList.remove("show"), 1600);
}
render();