class BookingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @service = Service.find(params[:service_id])
    @business = @service.business
  end

  def create
    service = Service.find(params[:service_id])
    business = service.business

    starts_at = Time.zone.parse(params[:starts_at].to_s)
    unless starts_at
      redirect_to new_booking_path(service_id: service.id), alert: "Please choose a valid time."
      return
    end

    duration =
      if service.respond_to?(:duration_min) && service.duration_min.present?
        service.duration_min.to_i
      else
        30
      end

    ends_at = starts_at + duration.minutes

    # Pick a staff member (since your DB currently requires staff_member_id NOT NULL)
    staff_member = business.staff_members.order(:id).first

    unless staff_member
      redirect_to new_booking_path(service_id: service.id), alert: "This business has no staff set up yet."
      return
    end

    booking = Booking.new(
      user: current_user,
      business: business,
      location: business.locations.order(:id).first, # if you have locations
      staff_member: staff_member,
      starts_at: starts_at,
      ends_at: ends_at,
      status: "confirmed",
      source: "direct"
    )

    if booking.save
      BookingItem.create!(booking: booking, service: service, quantity: 1) if defined?(BookingItem)

      redirect_to customer_booking_path(booking), notice: "Booking confirmed!"
    else
      redirect_to new_booking_path(service_id: service.id), alert: booking.errors.full_messages.to_sentence
    end
  end
end
