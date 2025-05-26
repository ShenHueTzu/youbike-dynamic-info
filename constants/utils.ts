export const getDistance = (
  target: google.maps.LatLng | google.maps.LatLngLiteral,
  station: google.maps.LatLng | google.maps.LatLngLiteral,
) => {
  const distance =
    window.google?.maps?.geometry?.spherical.computeDistanceBetween(
      target,
      station,
    );
  return distance;
};
