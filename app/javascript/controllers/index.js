import { application } from "./application"

import SearchbarController from "./searchbar_controller"
application.register("searchbar", SearchbarController)

import CalendarController from "./calendar_controller"
application.register("calendar", CalendarController)

import FlashController from "./flash_controller"
application.register("flash", FlashController)
