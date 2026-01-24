module Customer
  class DashboardController < ApplicationController
    before_action :authenticate_user!

    def index
      # Upcoming
      @upcoming_bookings = current_user.bookings
        .where("starts_at >= ?", Time.current)
        .order(starts_at: :asc)
        .limit(5)

      # Past
      @past_bookings = current_user.bookings
        .where("starts_at < ?", Time.current)
        .order(starts_at: :desc)
        .limit(10)
    end
  end
end
