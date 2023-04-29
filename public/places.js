
const markers = [];
let map;
console.log(markers, "Markers Array")
function addMarker(){
$.ajax({
  url: '/data',
  type: 'GET',
  dataType: 'json',
  success: function(data) {
      for (var i = 0; i < data.length; i++) {
          const item = data[i];
          const marker = L.marker([item.lat, item.lng], {item_id: item.id}).addTo(map);
          marker.bindPopup(`<b>${item.prefix}</b> <b>${item.firstname}</b> <b>${item.lastname}</b> <br/>${item.street} ${item.city} ${item.state} ${item.zip} `);
          markers.push(marker);
      }
  },
  error: function(xhr, status, error) {
    console.log(data)
    console.error('Error fetching data:', error);
  }
});

}
const on_row_click = (e) => {
  console.log("onclick")
  let row = e.target.closest('.row');
  if (!row) {
    return;
  }

  // Get data attributes from row
  const lat = row.dataset.lat;
  const lng = row.dataset.lng;
  console.log(lat, lng);

  // Update map
  map.flyTo(new L.LatLng(lat, lng));
};


const loadPlaces = async () => {
  const response = await axios.get('/data');
  const listItems = document.querySelector('#contact-list-item');
  const container = document.getElementById('listcontainer');
  listItems.addEventListener('click', on_row_click);
  if (response && response.data) {
    for (const contact of response.data) {
      const row = document.createElement('div');
      row.classList.add('row');
      row.id = 'rowitem';

      row.dataset.lat = contact.lat;
      row.dataset.lng = contact.lng;
      row.onclick = on_row_click;
      console.log(row, "row");

      // Add row to the container
      container.appendChild(row);
      console.log(container, row, "li and rows")

      const col1 = document.createElement('div');
      col1.classList.add('col-lg-2');
      const p1 = document.createElement('p');
      p1.classList.add('text-white');
      p1.textContent = `${contact.prefix} ${contact.firstname} ${contact.lastname}`;
      col1.appendChild(p1);
      row.appendChild(col1);

      const col2 = document.createElement('div');
      col2.classList.add('col-lg-2');
      const p2 = document.createElement('p');
      p2.classList.add('text-white');
      p2.textContent = contact.phonenumber;
      col2.appendChild(p2);
      row.appendChild(col2);

      const col3 = document.createElement('div');
      col3.classList.add('col-lg-3');
      const p3 = document.createElement('p');
      p3.classList.add('text-white');
      p3.textContent = contact.email;
      col3.appendChild(p3);
      row.appendChild(col3);

      const col4 = document.createElement('div');
      col4.classList.add('col-lg-3');
      const p4 = document.createElement('p');
      p4.classList.add('text-white');
      p4.textContent = `${contact.street} ${contact.city}, ${contact.state} ${contact.zip} ${contact.country}`;
      col4.appendChild(p4);
      row.appendChild(col4);

      const col5 = document.createElement('div');
      col5.classList.add('col-lg-1');
      const btnGroup = document.createElement('div');
      btnGroup.classList.add('btn-group', 'flex-column');
      btnGroup.setAttribute('role', 'group');

      const label1 = document.createElement('label');
      label1.htmlFor = `contactbyphone`;
      label1.textContent = 'Phone';
      const input1 = document.createElement('input');
      input1.id = `${contact.contactByPhone}-phone`;
      input1.type = 'checkbox';
      input1.disabled = true;
      input1.checked = contact.contactByPhone === 1;
      col5.appendChild(input1);
      col5.appendChild(label1);
      row.appendChild(col5);

      const col7 = document.createElement('div');
      col7.classList.add('col-lg-1');
      const label2 = document.createElement('label');
      label2.htmlFor = `contactbyemail`;
      label2.textContent = 'Email';
      const input2 = document.createElement('input');
      input2.id = `${contact.contactByEmail}-email`;
      input2.type = 'checkbox';
      input2.disabled = true;
      input2.checked = contact.contactByEmail === 1;
      col5.appendChild(input2);
      col5.appendChild(label2);
      row.appendChild(col5);

      const col8 = document.createElement('div');
      col8.classList.add('col-lg-1');
      const label3 = document.createElement('label');
      label3.htmlFor = `contactbymail`;
      label3.textContent = 'Mail';
      const input3 = document.createElement('input');
      input3.id = `${contact.contactByMail}-mail`;
      input3.type = 'checkbox';
      input3.disabled = true;
      input3.checked = contact.contactByMail === 1;
      col5.appendChild(input3);
      col5.appendChild(label3);
      row.appendChild(col5);

      const col9 = document.createElement('div');
      col9.classList.add('col');
      const btn = document.createElement('a');
      btn.classList.add('btn', 'btn-link', 'view-button');
      btn.textContent = 'View';
      btn.href = `${contact.id}`;
      col9.appendChild(btn);
      row.appendChild(col9);


      listItems.appendChild(row);
    }
  }
  addMarker();
}


const map_init = async () => {
  map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}