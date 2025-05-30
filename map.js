const map = L.map('map').setView([40.0, -5.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tracé GeoJSON depuis GitHub
fetch('https://raw.githubusercontent.com/geronimosm/caballarius-data/refs/heads/main/via_plata_sinuous.geojson')
  .then(res => res.json())
  .then(geojson => {
    const route = L.geoJSON(geojson, {
      style: {
        color: '#b60000',
        weight: 3,
        opacity: 0.9
      }
    }).addTo(map);
    map.fitBounds(route.getBounds());
  });

// Fiches Caballarius JSON
let fichesData = [];
fetch('https://raw.githubusercontent.com/geronimosm/caballarius-data/refs/heads/main/caballarius_fiches.json')
  .then(res => res.json())
  .then(data => { fichesData = data; });

// Marqueurs d'étapes
fetch('https://raw.githubusercontent.com/geronimosm/caballarius-data/refs/heads/main/waypoints.geojson')
  .then(res => res.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      pointToLayer: function(feature, latlng) {
        const marker = L.circleMarker(latlng, {
          radius: 4,
          fillColor: '#ffffff',
          color: '#b60000',
          weight: 1.5,
          fillOpacity: 1
        });

        marker.bindTooltip(feature.properties.name || "Étape", {
          permanent: false,
          direction: 'top'
        });

        marker.on("click", function () {
          const nom = feature.properties.name;
          const fiche = fichesData.find(f => f.name === nom);
          const html = fiche ? fiche.popup : `<b>${nom}</b><br>Aucune fiche disponible.`;
          marker.bindPopup(html).openPopup();
        });

        marker.on("mouseover", () => marker.setStyle({ radius: 7 }));
        marker.on("mouseout", () => marker.setStyle({ radius: 4 }));

        return marker;
      }
    }).addTo(map);
  });
