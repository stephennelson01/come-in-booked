import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "date", "time"]

  open(event) {
    this.dateTarget.textContent = event.currentTarget.dataset.calendarDateValue
    this.timeTarget.textContent = event.currentTarget.dataset.calendarTimeValue
    this.modalTarget.classList.remove("hidden")
  }

  close() {
    this.modalTarget.classList.add("hidden")
  }
}
