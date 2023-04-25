
const markers = []
let map; 

const addPlace = async () => {
  const label = document.querySelector("#label").value;
  const address = document.querySelector("#address").value;
  await axios.put('/places', { label: label, address: address });
  await loadPlaces();
}

const deletePlace = async (id) => {
  await axios.delete(`/places/${id}`);

  // Find all markers associated with the deleted place
  const indexes = markers.reduce((acc, marker, index) => {
    if (marker.options.place_id === id) {
      acc.push(index);
    }
    return acc;
  }, []);

  // Remove all markers from the map and markers array
  indexes.reverse().forEach(index => {
    const marker = markers.splice(index, 1)[0];
    map.removeLayer(marker);
  });

  // Re-add the remaining markers to the map
  await addMarker();

  // Reload the places table
  loadPlaces();
};

const addMarker = async () => {
  try {
    const response = await axios.get('/places');
    const places = response.data.places;
    const coordes = response.data.coordinates;
    places.forEach(place => {
      const cord = coordes.find(c => c.id === place.id);
      if (place.label && place.address && cord && cord.lat && cord.lng) {
        const marker = L.marker([cord.lat, cord.lng], { place_id: place.id }).addTo(map).bindPopup(`<b>${place.label}</b><br/>${place.address}`);
        markers.push(marker);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

const on_row_click = (e) => {
  let row = e.target;
  if (e.target.tagName.toUpperCase() === 'TD') {
    row = e.target.parentNode;
  }
  const lat = row.dataset.lat;
  const lng = row.dataset.lng;
  console.log(lat,"lat click")
  console.log(lng,"lng click")
  map.flyTo(new L.LatLng(lat, lng));
};

const loadPlaces = async () => {
  const response = await axios.get('/places');
  const tbody = document.querySelector('tbody');
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  if (response && response.data && response.data.places && response.data.coordinates) {
    for (const place of response.data.places) {
      const coordIndex = response.data.coordinates.findIndex(coord => coord.id === place.id);
      if (coordIndex >= 0) {
        const coord = response.data.coordinates[coordIndex];
        const tr = document.createElement('tr');
        tr.dataset.lat = coord.lat;
        tr.dataset.lng = coord.lng;
        tr.onclick = on_row_click;
        tr.innerHTML = `
          <td>${place.label}</td>
          <td>${place.address}</td>
          <td>
            <button class='btn btn-danger' onclick='deletePlace(${place.id})'>Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      }
    }
  }
  await addMarker();
};

const map_init = async () => {
  map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}