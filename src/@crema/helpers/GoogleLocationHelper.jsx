// utils/googleMapsUtils.js
export class GoogleMapsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.geocoder = null;
    this.isLoaded = false;
  }

  // Load Google Maps script
  loadGoogleMaps() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        this.geocoder = new window.google.maps.Geocoder();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        this.geocoder = new window.google.maps.Geocoder();
        resolve();
      };
      
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Get address from coordinates
  async getAddressFromCoordinates(lat, lng) {
    if (!this.isLoaded) await this.loadGoogleMaps();

    return new Promise((resolve) => {
      this.geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = this.extractReadableAddress(results[0]);
            resolve(address);
          } else {
            resolve(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        }
      );
    });
  }

  // Calculate driving distance using Distance Matrix API
  async calculateDrivingDistance(originLat, originLng, destLat, destLng) {
    if (!this.isLoaded) await this.loadGoogleMaps();

    return new Promise((resolve) => {
      const service = new window.google.maps.DistanceMatrixService();
      
      service.getDistanceMatrix({
        origins: [{ lat: originLat, lng: originLng }],
        destinations: [{ lat: destLat, lng: destLng }],
        travelMode: 'DRIVING',
        unitSystem: window.google.maps.UnitSystem.METRIC,
      }, (response, status) => {
        if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
          const element = response.rows[0].elements[0];
          resolve({
            distance: element.distance.text,
            duration: element.duration.text,
            distanceValue: element.distance.value,
            durationValue: element.duration.value
          });
        } else {
          // Fallback to straight-line distance
          const distance = this.calculateHaversineDistance(originLat, originLng, destLat, destLng);
          resolve({
            distance: `${distance.toFixed(1)} km`,
            duration: 'Unknown',
            distanceValue: distance * 1000
          });
        }
      });
    });
  }

  // Check if store is within delivery radius using actual driving distance
  async isStoreWithinDeliveryRadius(store, userLat, userLng, deliveryRadius = 10) {
    if (!store.location?.coordinates) return false;

    const [storeLng, storeLat] = store.location.coordinates;
    
    try {
      const distanceInfo = await this.calculateDrivingDistance(
        userLat, userLng, storeLat, storeLng
      );
      
      // Convert meters to kilometers for comparison
      const distanceInKm = distanceInfo.distanceValue / 1000;
      return distanceInKm <= deliveryRadius;
    } catch (error) {
      console.error('Error checking delivery radius:', error);
      // Fallback to Haversine distance
      const haversineDistance = this.calculateHaversineDistance(userLat, userLng, storeLat, storeLng);
      return haversineDistance <= deliveryRadius;
    }
  }

  // Get stores within delivery radius using Google Maps
  async filterStoresByRadius(stores, userLat, userLng, deliveryRadius = 10) {
    if (!stores || !userLat || !userLng) return [];

    const filteredStores = [];
    
    for (const store of stores) {
      if (await this.isStoreWithinDeliveryRadius(store, userLat, userLng, deliveryRadius)) {
        filteredStores.push(store);
      }
    }
    
    return filteredStores;
  }

  extractReadableAddress(result) {
    const addressComponents = result.address_components;
    let area = '';
    let city = '';

    for (const component of addressComponents) {
      const types = component.types;
      if (types.includes('sublocality') || types.includes('neighborhood')) {
        area = component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      }
    }

    return area && city ? `${area}, ${city}` : (city || result.formatted_address.split(',')[0]);
  }

  calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const googleMapsService = new GoogleMapsService('AIzaSyDiMFGT0VJq9FRjuCXczF3Df1rhnAQf_hE');