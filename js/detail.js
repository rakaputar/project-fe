
checkAuth();

const getIdFromURL = () => {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
};

let currentSmartphone = null; // Menyimpan data smartphone saat ini

const loadBrands = async () => {
  const res = await fetch(`${API_URL}/brands`);
  if (!res.ok) return [];
  return await res.json();
};

const loadDetail = async () => {
  const id = getIdFromURL();
  const res = await fetch(`${API_URL}/smartphones/${id}`);
  if (!res.ok) {
    alert("Smartphone tidak ditemukan.");
    window.location.href = "index.html";
    return;
  }
  const s = await res.json();
  currentSmartphone = s;

  const resFav = await fetchWithAuth(`${API_URL}/favorites`);
  const favorites = await resFav.json();
  const isFav = favorites.some(f => f.id == s.id);

  const container = document.getElementById("detail");
  container.innerHTML = `
    <div class="row">
      <div class="col-md-5 text-center">
        <img src="${s.image || 'https://via.placeholder.com/400'}" alt="${s.name}" class="img-fluid rounded mb-3" style="max-height: 400px;" />
      </div>
      <div class="col-md-7 d-flex flex-column justify-content-between">
        <div>
          <h3 class="mb-3">${s.name}</h3>
          <div class="spec-row d-flex">
            <div class="spec-label">Brand</div>
            <div>${s.brand.name}</div>
          </div>
          <div class="spec-row d-flex">
            <div class="spec-label">Processor</div>
            <div>${s.processor}</div>
          </div>
          <div class="spec-row d-flex">
            <div class="spec-label">Memory</div>
            <div>${s.memory}</div>
          </div>
          <div class="spec-row d-flex">
            <div class="spec-label">Battery</div>
            <div>${s.battery}</div>
          </div>
          <div class="spec-row d-flex">
            <div class="spec-label">Price</div>
            <div>Rp ${s.price.toLocaleString("id-ID")}</div>
          </div>
        </div>

        <!-- Tombol Edit dan Delete dibungkus dalam div ini -->
        <div id="actionButtons" class="d-none justify-content-between align-items-center mt-4">
            <div>
                <button id="editBtn" class="icon-btn me-2" type="button" title="Edit Smartphone" aria-label="Edit Smartphone">
                <i class="bi bi-pencil-square"></i>
                </button>
                <button id="deleteBtn" class="icon-btn danger" type="button" title="Hapus Smartphone" aria-label="Hapus Smartphone">
                <i class="bi bi-trash"></i>
                </button>
            </div>
            <div>
                <button id="favBtn" class="fav-btn ${isFav ? 'favorited' : ''}" title="Favorite" aria-label="Toggle Favorite">
                <i class="bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
            </div>
        </div>
  `;

  // Event tombol favorite
  document.getElementById("favBtn").addEventListener("click", () => toggleFavorite(s.id, isFav));

  // Event tombol edit
  document.getElementById("editBtn").addEventListener("click", () => openEditModal());

  // Event tombol hapus
  document.getElementById("deleteBtn").addEventListener("click", () => deleteSmartphone(s.id));

  // // Event untuk tombol submit kode unik
  // document.getElementById("submitCode").addEventListener("click", () => {
  //   const codeInput = document.getElementById("uniqueCode").value;
  //   const validCode = "ADMINPUNYAKUASA"; //kode unik
  // });
};

const toggleFavorite = async (id, isFav) => {
  if (isFav) {
    await fetchWithAuth(`${API_URL}/favorites/${id}`, { method: "DELETE" });
  } else {
    await fetchWithAuth(`${API_URL}/favorites/${id}`, { method: "POST" });
  }
  loadDetail(); // reload untuk update status ikon
};

const openEditModal = async () => {
  const modal = new bootstrap.Modal(document.getElementById("editSmartphoneModal"));
  const form = document.getElementById("editSmartphoneForm");

  // Isi form dengan data smartphone saat ini
  form.reset();

  // Ambil daftar brand dan isi dropdown
  const brands = await loadBrands();
  const selectBrand = document.getElementById("editBrand");
  selectBrand.innerHTML = brands.map(b => 
    `<option value="${b.id}" ${b.id === currentSmartphone.brandId ? "selected" : ""}>${b.name}</option>`
  ).join("");

  document.getElementById("editName").value = currentSmartphone.name;
  document.getElementById("editProcessor").value = currentSmartphone.processor;
  document.getElementById("editMemory").value = currentSmartphone.memory;
  document.getElementById("editBattery").value = currentSmartphone.battery;
  document.getElementById("editPrice").value = currentSmartphone.price;
  document.getElementById("editImage").value = currentSmartphone.image || "";

  modal.show();
};

document.getElementById("editSmartphoneForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = getIdFromURL();
  const form = e.target;

  const updatedData = {
    name: form.name.value.trim(),
    brandId: Number(form.brandId.value),
    processor: form.processor.value.trim(),
    memory: form.memory.value.trim(),
    battery: form.battery.value.trim(),
    price: Number(form.price.value),
    image: form.image.value.trim() || null,
  };

  // Validasi dasar
  if (!updatedData.name || !updatedData.processor || !updatedData.memory || !updatedData.battery || !updatedData.price || !updatedData.brandId) {
    alert("Mohon lengkapi semua data yang wajib.");
    return;
  }

  try {
    const res = await fetchWithAuth(`${API_URL}/smartphones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Gagal mengupdate data");

    const modalEl = document.getElementById("editSmartphoneModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    alert("Smartphone berhasil diperbarui.");
    loadDetail();

  } catch (err) {
    alert(err.message);
  }
});

const deleteSmartphone = async (id) => {
  if (!confirm("Yakin ingin menghapus smartphone ini? Data yang sudah dihapus tidak dapat dikembalikan.")) return;

  try {
    const res = await fetchWithAuth(`${API_URL}/smartphones/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal menghapus smartphone.");

    alert("Smartphone berhasil dihapus.");
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
};



window.loadDetail = loadDetail;
