const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const flattened = {timestamp: pos.timestamp, ...pos.coords};
      resolve(flattened)
      resolve(pos);
    }, (err) => {
      reject(err);
    }, options)})
};
