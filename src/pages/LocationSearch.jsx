import { useState, useEffect } from 'react';
import { Input, Card, List, Button } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../Components/styles/Dashboard.css";

const { Search } = Input;

const LocationSearch = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]); // Store routes

  useEffect(() => {
    const mapInstance = L.map('map', {
      doubleClickZoom: false
    }).setView([0, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Add marker on double-click
    mapInstance.on('dblclick', (e) => {
      e.originalEvent.preventDefault();
      const { lat, lng } = e.latlng;
      addMarker(lat, lng);
    });

    // Add marker on right-click (context menu)
    mapInstance.on('contextmenu', (e) => {
      e.originalEvent.preventDefault();
      const { lat, lng } = e.latlng;
      addMarker(lat, lng);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const addMarker = (lat, lng) => {
    const newMarker = L.marker([lat, lng], { draggable: true }); // Make marker draggable
    newMarker.addTo(map);

    // Update marker coordinates when dragged
    newMarker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      updateMarkerCoordinates(newMarker, lat, lng);
    });

    setMarkers(prev => [...prev, {
      id: Date.now(), // Unique ID for each marker
      marker: newMarker,
      coordinates: {
        lat: Number(lat).toFixed(6),
        lng: Number(lng).toFixed(6)
      }
    }]);
  };

  const updateMarkerCoordinates = (marker, lat, lng) => {
    setMarkers(prev => prev.map(m => {
      if (m.marker === marker) {
        return {
          ...m,
          coordinates: {
            lat: Number(lat).toFixed(6),
            lng: Number(lng).toFixed(6)
          }
        };
      }
      return m;
    }));
  };

  const removeMarker = (id) => {
    setMarkers(prev => {
      const markerToRemove = prev.find(m => m.id === id);
      if (markerToRemove) {
        markerToRemove.marker.remove(); // Remove from map
      }
      return prev.filter(m => m.id !== id);
    });
  };

  const searchLocation = async (query) => {
    if (!query) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'YourAppName'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        addMarker(lat, lon);
        map.setView([lat, lon], 13);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRoute = async () => {
    if (markers.length < 2) {
      alert('You need at least 2 markers to calculate a route.');
      return;
    }

    // Get coordinates of all markers
    const coordinates = markers.map(m => [m.coordinates.lng, m.coordinates.lat]);

    try {
      // Use OpenRouteService API to calculate the route
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '5b3ce3597851110001cf6248edc3d3b1483f4ad0a371e95f9e099c96' // Replace with your API key
          },
          body: JSON.stringify({
            coordinates: coordinates,
            instructions: false
          })
        }
      );

      const data = await response.json();

      // Extract the route geometry
      const routeGeometry = data.features[0].geometry.coordinates;

      // Convert coordinates to Leaflet's format [lat, lng]
      const routeLatLng = routeGeometry.map(coord => [coord[1], coord[0]]);

      // Draw the route on the map
      const routePolyline = L.polyline(routeLatLng, { color: 'blue' }).addTo(map);

      // Store the route for later removal
      setRoutes(prev => [...prev, routePolyline]);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const clearRoutes = () => {
    routes.forEach(route => route.remove()); // Remove all routes from the map
    setRoutes([]); // Clear the routes state
  };

  return (
    <div className="map-container">
      <Card className="search-overlay">
        <Search
          placeholder="Search location..."
          enterButton={<SearchOutlined />}
          size="large"
          loading={loading}
          onSearch={searchLocation}
        />
        <List
          className="markers-list"
          size="small"
          dataSource={markers}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeMarker(item.id)}
                />
              ]}
            >
              <List.Item.Meta
                title={`Marker ${markers.indexOf(item) + 1}`}
                description={
                  <>
                    <div>Lat: {item.coordinates.lat}</div>
                    <div>Lng: {item.coordinates.lng}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
        <Button type="primary" onClick={calculateRoute} style={{ marginTop: 16 }}>
          Calculate Route
        </Button>
        <Button type="default" onClick={clearRoutes} style={{ marginTop: 8 }}>
          Clear Routes
        </Button>
      </Card>
      <div id="map" className="map"></div>
    </div>
  );
};

export default LocationSearch;