module Merchant
  class BookingsController < ApplicationController
    layout "merchant"

    before_action :authenticate_partner!
    before_action :set_business

    def index
      start_col = Booking.column_names.include?("starts_at") ? "starts_at" : "start_at"

      @bookings = @business.bookings
        .includes(:user, :location, :staff_member, booking_items: :service)
        .order(start_col => :desc)
        .limit(100)
    end

    def show
      @booking = @business.bookings
        .includes(:user, :location, :staff_member, booking_items: :service)
        .find(params[:id])

      # mark read
      if @booking.respond_to?(:read_by_partner_at) && @booking.read_by_partner_at.nil?
        @booking.update_column(:read_by_partner_at, Time.current)
      end
    end

    private

    def set_business
      @business = Business.where(partner_id: current_partner.id).order(created_at: :asc).first
      redirect_to for_business_path, alert: "Create your business first." unless @business
    end
  end
end
