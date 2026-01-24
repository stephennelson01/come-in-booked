import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    timeout: { type: Number, default: 3000 } // ms
  }

  connect() {
    // small delay so it’s visible even on fast renders
    this._timer = setTimeout(() => this.dismiss(), this.timeoutValue)
  }

  disconnect() {
    if (this._timer) clearTimeout(this._timer)
  }

  dismiss() {
    // fade + slide, then remove from DOM
    this.element.classList.add("opacity-0", "-translate-y-1")
    setTimeout(() => {
      this.element.remove()
    }, 220)
  }
}
