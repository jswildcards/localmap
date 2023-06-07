import { AutocompleteResponse } from "../models/GoogleMapAPI/AutocompleteResponse"
import { GeocodeResponse } from "../models/GoogleMapAPI/GeocodeResponse"
import { PlaceDetailResponse } from "../models/GoogleMapAPI/PlaceDetailResponse"
import { TimezoneResponse } from "../models/GoogleMapAPI/TimezoneResponse"

const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY

const AUTOCOMPLETE_BASE_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_MAP_API_KEY}`
const PLACE_DETAIL_BASE_URL = `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_MAP_API_KEY}`
const TIMEZONE_BASE_URL     = `https://maps.googleapis.com/maps/api/timezone/json?key=${GOOGLE_MAP_API_KEY}`
const GEOCODE_BASE_URL      = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_MAP_API_KEY}`

async function fetchAddressLookupDetail({ lat, lng }: google.maps.LatLngLiteral) {
  const response = await fetch(`${GEOCODE_BASE_URL}&latlng=${lat},${lng}`)
  const { results } = await response.json()
  return results as GeocodeResponse
}

async function fetchAutocomplete(input: string) {
  const response = await fetch(`${AUTOCOMPLETE_BASE_URL}&input=${input}`)
  const { predictions } = await response.json()
  return predictions as AutocompleteResponse
}

async function fetchPlaceDetail(placeId: string) {
  const response = await fetch(`${PLACE_DETAIL_BASE_URL}&place_id=${placeId}`)
  const { result } = await response.json()
  return result as PlaceDetailResponse
}

async function fetchTimezone({ lat, lng }: google.maps.LatLngLiteral) {
  const response = await fetch(`${TIMEZONE_BASE_URL}&timestamp=${Math.floor(new Date().valueOf() / 1000)}&location=${lat},${lng}`)
  const result = await response.json()
  return result as TimezoneResponse
}

export {
  fetchAddressLookupDetail,
  fetchAutocomplete,
  fetchPlaceDetail,
  fetchTimezone,
}
