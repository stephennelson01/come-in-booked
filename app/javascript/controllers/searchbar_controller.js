import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["lat", "lng", "whereInput"]

  useCurrent() {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        this.latTarget.value = latitude
        this.lngTarget.value = longitude
        if (this.hasWhereInputTarget) this.whereInputTarget.value = "Current location"
      },
      () => alert("Location permission denied. You can type a city/area instead.")
    )
  }
}
