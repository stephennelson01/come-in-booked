module Merchant
  class DashboardController < ApplicationController
    layout "merchant"

    before_action :authenticate_partner!
    before_action :set_business

    def index
      start_col = Booking.column_names.include?("starts_at") ? "starts_at" : "start_at"

      @recent_bookings = @business.bookings
        .includes(:user, :location, :staff_member, booking_items: :service)
        .order(start_col => :desc)
        .limit(8)
    end

    private

    def set_business
      @business = Business.where(partner_id: current_partner.id).order(created_at: :asc).first
      redirect_to for_business_path, alert: "Create your business first." unless @business
    end
  end
end
