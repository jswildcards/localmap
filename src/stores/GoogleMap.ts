import { defineStore } from 'pinia'
import { Loader } from '@googlemaps/js-api-loader'

import { fetchAddressLookupDetail, fetchAutocomplete, fetchPlaceDetail, fetchTimezone } from '../utils/GoogleMapAPI'
import SearchHistoryRecord from '../models/SearchHistoryRecord'

interface AutocompleteSuggestionRecord {
  place_id: string
  description: string
}

interface State {
  isInitialized: boolean
  center: google.maps.LatLngLiteral
  zoom: number
  isSuggesting: boolean
  autocompleteSuggestionRecords: AutocompleteSuggestionRecord[]
  mapContainer: google.maps.Map | null
  searchHistoryRecords: Map<string, SearchHistoryRecord>
  numberOfSearchHistoryRecordsPerPage: number
  searchHistoryPage: number
  selectedSearchHistoryRecords: Set<string>
}

const TORONTO_CENTER = { lat: 43.7181228, lng: -79.542863 }
const TORONTO_ZOOM = 11

export const useGoogleMapStore = defineStore('GoogleMap', {
  state: (): State => ({
    isInitialized: false,
    center: TORONTO_CENTER,
    zoom: TORONTO_ZOOM,
    isSuggesting: false,
    autocompleteSuggestionRecords: [],
    mapContainer: null,
    searchHistoryRecords: new Map(),
    numberOfSearchHistoryRecordsPerPage: 10,
    searchHistoryPage: 1,
    selectedSearchHistoryRecords: new Set(),
  }),
  getters: {
    hasAutocompleteSuggestionRecords: function(state: State) {
      return state.autocompleteSuggestionRecords.length > 0
    },
    searchHistoryList: function(state: State) {
      const itemPerPage = state.numberOfSearchHistoryRecordsPerPage
      const page = state.searchHistoryPage

      return Array.from(state.searchHistoryRecords).
        map(([_, record]) => record).
        reverse().
        filter((_, index) => {
          return (page - 1) * itemPerPage <= index && index < page * itemPerPage
        })
    },
    latestSearchHistoryRecord: function(state: State) {
      return Array.from(state.searchHistoryRecords).pop()?.[1] ?? null
    },
    hasSearchHistory: function(state: State) {
      return state.searchHistoryRecords.size > 0
    },
    hasSelectedSearchHistoryRecords: function(state: State) {
      return state.selectedSearchHistoryRecords.size > 0
    },
    searchHistoryTotalPages: function(state: State) {
      const numberOfRecords = state.searchHistoryRecords.size
      const recordsPerPage = state.numberOfSearchHistoryRecordsPerPage
      return Math.floor(numberOfRecords / recordsPerPage) + (numberOfRecords % recordsPerPage > 0 ? 1 : 0)
    },
    allSearchHistoryPages: function(state: State) {
      const totalPages = this.searchHistoryTotalPages
      const currentPage = state.searchHistoryPage

      if(totalPages < 6) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
      } else {
        const pages: (string | number)[] = [1]

        if(currentPage > 3)
          pages.push('...')

        if(currentPage > 2)
          pages.push(currentPage - 1)

        if(currentPage > 1 && currentPage < totalPages)
          pages.push(currentPage)

        if(currentPage < totalPages - 1)
          pages.push(currentPage + 1)

        if(currentPage < totalPages - 2)
          pages.push('...')

        pages.push(totalPages)

        return pages
      }
    },
  },
  actions: {
    initialize: async function() {
      if(!this.isInitialized) {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
        })

        await loader.load()
        this.isInitialized = true
      }
    },
    setIsSuggesting: function(isSuggesting: boolean) {
      this.isSuggesting = isSuggesting
    },
    getAutocompleteSuggestions: async function(keywords: string) {
      this.autocompleteSuggestionRecords = await fetchAutocomplete(keywords)
      this.setIsSuggesting(true)
    },
    locateMe: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position: GeolocationPosition) => {
            const latlng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const addressLookupDetail = await fetchAddressLookupDetail(latlng)
            this.addNewSearchHistoryRecord(addressLookupDetail[0].place_id)
          },
          () => {
            alert("Your browser does not support geolocation.")
          }
        );
      } else {
        alert("Your browser does not support geolocation.")
      }
    },
    addNewSearchHistoryRecord: async function(placeId: string) {
      let record: SearchHistoryRecord | null = null

      if(this.searchHistoryRecords.has(placeId)) {
        record = this.removeSearchHistoryRecord(placeId)
      } else {
        const placeDetail = await fetchPlaceDetail(placeId)
        const latlng = placeDetail.geometry.location
        const timezone = await fetchTimezone(latlng)
        const utcOffset = timezone.rawOffset + timezone.dstOffset

        const marker = this.createMapMarker(latlng)
        record = new SearchHistoryRecord(placeId, placeDetail.formatted_address, latlng, marker, utcOffset, timezone.timeZoneId, timezone.timeZoneName)
      }

      record = record as SearchHistoryRecord
      this.searchHistoryRecords.set(placeId, record)
      this.setMapCenter(record.latlng)
      this.addMarkerToMap(record.marker)
      this.setIsSuggesting(false)
    },
    removeSearchHistoryRecord: function(placeId: string) {
      if(!this.searchHistoryRecords.has(placeId)) {
        return null
      }

      const record = this.searchHistoryRecords.get(placeId) as SearchHistoryRecord
      this.removeMarkerFromMap(record.marker)
      this.searchHistoryRecords.delete(placeId)
      return record
    },
    deleteSelectedSearchHistoryRecords: function() {
      this.selectedSearchHistoryRecords.forEach((placeId: string) => {
        this.removeSearchHistoryRecord(placeId)
      })

      this.selectedSearchHistoryRecords.clear()
    },
    addMarkerToMap: function(marker: google.maps.Marker) {
      marker.setMap(this.mapContainer)
      marker.setVisible(true)
    },
    removeMarkerFromMap: function(marker: google.maps.Marker) {
      marker.setVisible(false)
    },
    createMapMarker: function(position: google.maps.LatLngLiteral) {
      return new google.maps.Marker({
        position,
      })
    },
    setMapCenter: function(center: google.maps.LatLngLiteral) {
      this.center = center
      this.mapContainer.setCenter(this.center)
    },
    createMapContainer: function(mapContainerElement: HTMLElement) {
      this.mapContainer = new google.maps.Map(mapContainerElement, {
        center: this.center,
        zoom: this.zoom,
        disableDefaultUI: true,
        zoomControl: true,
      })
    },
    setSearchHistoryPage: function(page: number) {
      this.searchHistoryPage = page
    },
    increaseSearchHistoryPage: function() {
      this.setSearchHistoryPage(this.searchHistoryPage + 1)
    },
    decreaseSearchHistoryPage: function() {
      this.setSearchHistoryPage(this.searchHistoryPage - 1)
    },
    addSelectedSearchHistoryRecord: function(placeId: string) {
      this.selectedSearchHistoryRecords.add(placeId)
    },
    removeSelectedSearchHistoryRecord: function(placeId: string) {
      this.selectedSearchHistoryRecords.delete(placeId)
    },
    toggleSelectedSearchHistoryRecord: function(placeId: string) {
      if(this.selectedSearchHistoryRecords.has(placeId))
        this.removeSelectedSearchHistoryRecord(placeId)
      else
        this.addSelectedSearchHistoryRecord(placeId)
    },
  },
})
