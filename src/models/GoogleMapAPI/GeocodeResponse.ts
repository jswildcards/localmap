interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface Bounds {
  northeast: google.maps.LatLngLiteral
  southwest: google.maps.LatLngLiteral
}

interface Viewport {
  northeast: google.maps.LatLngLiteral
  southwest: google.maps.LatLngLiteral
}

interface Geometry {
  bounds: Bounds
  location: google.maps.LatLngLiteral
  location_type: string
  viewport: Viewport
}

interface PlusCode {
  compound_code: string
  global_code: string
}

interface GeocodeResult {
  address_components: AddressComponent[]
  formatted_address: string
  geometry: Geometry
  place_id: string
  plus_code: PlusCode
  types: string[]
}

type GeocodeResponse = GeocodeResult[]

export type {
  GeocodeResponse,
}
