export default class SearchHistoryRecord {
  placeId: string
  address: string
  latlng: google.maps.LatLngLiteral
  marker: google.maps.Marker
  utcOffset: number
  timezoneId: string
  timezoneName: string

  constructor(placeId: string, address: string, latlng: google.maps.LatLngLiteral, marker: google.maps.Marker, utcOffset: number, timezoneId: string, timezoneName: string) {
    this.placeId = placeId
    this.address = address
    this.latlng = latlng
    this.marker = marker
    this.utcOffset = utcOffset
    this.timezoneId = timezoneId
    this.timezoneName = timezoneName
  }
}
