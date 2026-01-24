module Customer
  class BookingsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_booking, only: [:show]

    def index
      start_col = Booking.column_names.include?("starts_at") ? "starts_at" : "start_at"

      @bookings = current_user.bookings
        .includes(:business, :location, :staff_member, booking_items: :service)
        .order(start_col => :desc)
    end

    def show
      @just_confirmed = params[:confirmed].present?
      @service = @booking.booking_items.first&.service
    end

    def new
      @service  = Service.find(params[:service_id])
      @business = @service.business
    end

    def create
      @service  = Service.find(params[:service_id])
      @business = @service.business

      starts_at = parse_datetime(params[:starts_at])
      unless starts_at
        flash.now[:alert] = "Please choose a valid date and time."
        render :new, status: :unprocessable_entity
        return
      end

      duration_min = (@service.respond_to?(:duration_min) && @service.duration_min.present?) ? @service.duration_min.to_i : 30
      ends_at = starts_at + duration_min.minutes

      staff_member = @business.staff_members.order(:id).first if @business.respond_to?(:staff_members)
      location     = @business.locations.order(:id).first     if @business.respond_to?(:locations)

      # If DB enforces NOT NULL, block booking with a helpful message
      if Booking.columns_hash["staff_member_id"]&.null == false && staff_member.nil?
        flash.now[:alert] = "This business can’t accept bookings yet (no staff set)."
        render :new, status: :unprocessable_entity
        return
      end

      if Booking.columns_hash["location_id"]&.null == false && location.nil?
        flash.now[:alert] = "This business can’t accept bookings yet (no location set)."
        render :new, status: :unprocessable_entity
        return
      end

      attrs = {
        user: current_user,
        business: @business,
        status: "confirmed",
        customer_name: params[:customer_name].to_s.strip.presence,
        staff_member: staff_member,
        location: location
      }.compact

      if Booking.column_names.include?("starts_at")
        attrs[:starts_at] = starts_at
        attrs[:ends_at]   = ends_at
      else
        attrs[:start_at] = starts_at
        attrs[:end_at]   = ends_at
      end

      booking = Booking.new(attrs)

      Booking.transaction do
        booking.save!

        # Link service to booking so merchant sees “what was booked”
        item_attrs = { service: @service }

        if defined?(BookingItem)
          item_attrs[:quantity] = 1 if BookingItem.column_names.include?("quantity")
          item_attrs[:duration_min] = @service.duration_min.to_i if BookingItem.column_names.include?("duration_min") && @service.respond_to?(:duration_min)
          item_attrs[:price_cents]  = @service.price_cents.to_i  if BookingItem.column_names.include?("price_cents")  && @service.respond_to?(:price_cents)
        end

        booking.booking_items.create!(item_attrs) if booking.respond_to?(:booking_items)
      end

      Rails.logger.info("[BOOKING] created booking_id=#{booking.id} business_id=#{@business.id} service_id=#{@service.id} user_id=#{current_user.id}")

      redirect_to customer_booking_path(booking, confirmed: 1),
                  notice: "Booking confirmed ✅"
    rescue ActiveRecord::RecordInvalid => e
      flash.now[:alert] = e.record.errors.full_messages.first || "Could not create booking."
      render :new, status: :unprocessable_entity
    end

    private

    def set_booking
      @booking = current_user.bookings
        .includes(:business, :location, :staff_member, booking_items: :service)
        .find(params[:id])
    end

    def parse_datetime(value)
      return nil if value.blank?
      Time.zone.parse(value.to_s)
    rescue ArgumentError, TypeError
      nil
    end
  end
end
