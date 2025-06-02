checkAuth();

const loadSmartphones = async () => {
  const res = await fetch(`${API_URL}/smartphones`);
  const data = await res.json();
  const container = document.getElementById("smartphones");

  container.innerHTML = "";
  data.forEach((s) => {
    container.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 mb-4">
        <div class="card h-100">
          <img src="${s.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${s.name}" />
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${s.name}</h5>
              <p class="card-text"><strong>Brand:</strong> ${s.brand.name}</p>
            </div>
            <a href="detail.html?id=${s.id}" class="btn btn-modern mt-3">Details</a>
          </div>
        </div>
      </div>
    `;
  });
};

const deleteSmartphone = async (id) => {
  if (confirm("Are you sure?")) {
    await fetchWithAuth(`${API_URL}/smartphones/${id}`, { method: "DELETE" });
    alert("Deleted!");
    loadSmartphones();
  }
};
