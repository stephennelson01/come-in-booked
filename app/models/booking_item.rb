# app/models/booking_item.rb
class BookingItem < ApplicationRecord
  belongs_to :booking
  belongs_to :service

  # Some parts of the app (or older code) may call duration_minutes.
  # Your DB uses duration_min, so we provide a compatibility method.
  def duration_minutes
    if respond_to?(:duration_min) && duration_min.present?
      duration_min.to_i
    elsif service.respond_to?(:duration_min) && service.duration_min.present?
      service.duration_min.to_i
    else
      0
    end
  end
end
