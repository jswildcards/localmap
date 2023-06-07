interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface Geometry {
  location: google.maps.LatLngLiteral
  viewport: Record<string, google.maps.LatLngLiteral>
}

interface Photo {
  height: number
  html_attributions: string[]
  photo_reference: string
  width: number
}

interface PlaceDetailResponse {
  address_components: AddressComponent[]
  adr_address: string
  formatted_address: string
  geometry: Geometry
  icon: string
  icon_background_color: string
  icon_mask_base_uri: string
  name: string
  photos: Photo[]
  place_id: string
  reference: string
  types: string[]
  url: string
  utc_offset: number
  vicinity: string
}

export type {
  PlaceDetailResponse,
}
