checkAuth();

let allPhones = [];

const loadCompareOptions = async () => {
  const res = await fetch(`${API_URL}/smartphones`);
  allPhones = await res.json();

  const phone1 = document.getElementById("phone1");
  const phone2 = document.getElementById("phone2");

  allPhones.forEach(p => {
    phone1.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    phone2.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });
};

const compare = (e) => {
  e.preventDefault();
  const id1 = document.getElementById("phone1").value;
  const id2 = document.getElementById("phone2").value;

  const p1 = allPhones.find(p => p.id == id1);
  const p2 = allPhones.find(p => p.id == id2);

  const markBest = (val1, val2, type = "higher") => {
    let icon1 = "", icon2 = "";
    if (type === "higher") {
        if (val1 > val2) icon1 = `<i class="bi bi-check-circle-fill text-success ms-2"></i>`;
        else if (val2 > val1) icon2 = `<i class="bi bi-check-circle-fill text-success ms-2"></i>`;
    } else {
        if (val1 < val2) icon1 = `<i class="bi bi-check-circle-fill text-success ms-2"></i>`;
        else if (val2 < val1) icon2 = `<i class="bi bi-check-circle-fill text-success ms-2"></i>`;
    }
    return [icon1, icon2];
    };

    const parseMemory = (memString) => {
    const [ram, storage] = memString.replaceAll("GB", "").split("/").map(s => parseInt(s.trim()));
    return { ram, storage };
    };

    const [batIcon1, batIcon2] = markBest(parseInt(p1.battery), parseInt(p2.battery), "higher");
    const [priceIcon1, priceIcon2] = markBest(p1.price, p2.price, "lower");

    const m1 = parseMemory(p1.memory);
    const m2 = parseMemory(p2.memory);
    let [memIcon1, memIcon2] = markBest(m1.ram, m2.ram, "higher");
    if (!memIcon1 && !memIcon2) {
    [memIcon1, memIcon2] = markBest(m1.storage, m2.storage, "higher");
    }

  const result = document.getElementById("result");
  result.innerHTML = `
    <div class="card card-compare p-4">
      <div class="row mb-4">
        <div class="col-md-6 text-center">
          <img src="${p1.image || 'https://via.placeholder.com/200'}" class="phone-image" />
          <h5 class="mt-2">${p1.name}</h5>
        </div>
        <div class="col-md-6 text-center">
          <img src="${p2.image || 'https://via.placeholder.com/200'}" class="phone-image" />
          <h5 class="mt-2">${p2.name}</h5>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered compare-table align-middle text-center">
          <thead>
            <tr>
              <th>Specification</th>
              <th>${p1.name}</th>
              <th>${p2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Brand</td><td>${p1.brand.name}</td><td>${p2.brand.name}</td></tr>
            <tr><td>Processor</td><td>${p1.processor}</td><td>${p2.processor}</td></tr>
            <tr><td>Memory</td>
              <td>${p1.memory}${memIcon1}</td>
              <td>${p2.memory}${memIcon2}</td>
            </tr>
            <tr><td>Battery</td>
              <td>${p1.battery}${batIcon1}</td>
              <td>${p2.battery}${batIcon2}</td>
            </tr>
            <tr><td>Price</td>
              <td>Rp ${p1.price.toLocaleString("id-ID")}${priceIcon1}</td>
              <td>Rp ${p2.price.toLocaleString("id-ID")}${priceIcon2}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
};
