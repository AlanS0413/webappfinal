let users = []
const markers = [];
let map;

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
  let li = e.target.closest('li');
  if (!li) {
    if (e.target.tagName.toUpperCase() === 'LI') {
      li = e.target.parentNode;
    }
    return;
  }

  let lat = e.target.dataset.lat;
  let lng = e.target.dataset.lng;
  let target = e.target;

  while ((!lat || !lng) && target.parentNode) {
    target = target.parentNode;
    lat = target.dataset.lat;
    lng = target.dataset.lng;
  }


  map.flyTo(new L.LatLng(lat, lng));
};

const viewContact = async (id) => {
  window.location.href = `/${id}`;
}

const loadPlaces = async () => {
  const response = await axios.get('/data');
  const ubody = document.querySelector('ul#contact-list')
  document.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI' || event.target.parentNode.tagName === 'LI') {
      const lat = event.target.dataset.lat || event.target.parentNode.dataset.lat;
      const lng = event.target.dataset.lng || event.target.parentNode.dataset.lng;
    }
  });
  if (response && response.data){
    for (const item of response.data){
    const listitem = document.createElement('li');
    listitem.dataset.lat = item.lat;
    listitem.dataset.lng = item.lng;
    ubody.onclick = on_row_click;
    listitem.innerHTML = `
      <hr>
      <li id="name"> ${item.prefix} ${item.firstname} ${item.lastname} </li>
      <li id ="phonenumber"> ${item.phonenumber} </li>
      <li id="email"> ${item.email} </li>
      <li id="address"> ${item.street +' ' + item.city +' '+ item.state +', '+ item.country}</li>
      <input id="${item.contactByPhone}-phone" type="checkbox" disabled="" ${item.contactByPhone === 1 ? 'checked' : ''}><label for="${item.id}-phone">Phone</label>
      <input id="${item.contactByEmail}-email" type="checkbox" disabled="" ${item.contactByEmail === 1 ? 'checked' : ''}><label for="${item.id}-email">Email</label>
      <input id="${item.contactByMail}-mail" type="checkbox" disabled="" ${item.contactByMail === 1 ? 'checked' : ''}><label for="${item.id}-mail">Mail</label>
      <li>
        <button class='btn btn-link text-white' onclick='viewContact(${item.id})'>View</button>
      </li>
      <hr>
    `;
    ubody.appendChild(listitem);
    users.push({ name: item.firstname, last: item.lastname, element: listitem });
    }
  }
  addMarker()
}



const map_init = async () => {
  map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}


const searchContact = async () =>{
  const searchInput = document.querySelector("#searchdata")
  searchInput.addEventListener('input', e =>{
    const value = e.target.value.toLowerCase();
    users.forEach(user => {
      const isVisible = user.name.toLowerCase().includes(value) || user.last.toLowerCase().includes(value)
      user.element.classList.toggle("invisible", !isVisible)
      if (isVisible) {
        user.element.style.order = -1; // move matching user to the top
      } else {
        user.element.style.order = ""; // reset order for non-matching users
      }
    })
  })
}