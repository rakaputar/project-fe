checkAuth();

const loadFavorites = async () => {
  const res = await fetchWithAuth(`${API_URL}/favorites`);
  const data = await res.json();
  const container = document.getElementById("favorites");

  container.innerHTML = "";
  data.forEach((s) => {
    container.innerHTML += `
    <div class="col-md-4">
        <div class="card h-100">
        <img src="${s.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${s.name}" />
        <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate">${s.name}</h5>
            <p class="card-text mb-3"><strong>Brand:</strong> ${s.brand?.name || 'Unknown'}</p>
            <a href="detail.html?id=${s.id}" class="btn btn-modern mt-3">Details</a>
        </div>
        </div>
    </div>
    `;
  });
};
