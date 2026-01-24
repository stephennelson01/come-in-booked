# app/controllers/merchant/calendar_controller.rb
module Merchant
  class CalendarController < ApplicationController
    layout "merchant"

    before_action :authenticate_partner!
    before_action :set_business

    def index
      # Pick a date to anchor the week
      @date = params[:date].present? ? Date.parse(params[:date]) : Date.current
      @week_start = @date.beginning_of_week(:monday)
      @week_days  = (@week_start..(@week_start + 6.days)).to_a

      # Hours to show in grid
      @hours = (7..20).to_a # 07:00 → 20:00 (change if you want)

      # Support either starts_at/ends_at OR start_at/end_at
      start_col = Booking.column_names.include?("starts_at") ? "starts_at" : "start_at"
      end_col   = Booking.column_names.include?("ends_at")   ? "ends_at"   : "end_at"

      range_start = @week_start.beginning_of_day
      range_end   = (@week_start + 6.days).end_of_day

      @bookings = @business.bookings
        .where("#{start_col} >= ? AND #{start_col} <= ?", range_start, range_end)
        .includes(:user, :location, booking_items: :service)
        .order(start_col => :asc)

      # Build a { day(Date) => { hour(Integer) => [bookings] } } hash for fast lookup in the view
      @bookings_by_day_hour = Hash.new { |h, k| h[k] = Hash.new { |h2, k2| h2[k2] = [] } }

      @bookings.each do |b|
        starts_at = b.public_send(start_col)
        next unless starts_at

        day  = starts_at.to_date
        hour = starts_at.hour

        @bookings_by_day_hour[day][hour] << b
      end
    end

    private

    def set_business
      @business = Business.where(partner_id: current_partner.id).order(created_at: :asc).first
      redirect_to for_business_path, alert: "Create your business first." unless @business
    end
  end
end
