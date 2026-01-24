class Booking < ApplicationRecord
  belongs_to :business
  belongs_to :location, optional: true
  belongs_to :user
  belongs_to :staff_member, optional: true

  has_many :booking_items, dependent: :destroy

  STATUSES = %w[pending confirmed cancelled].freeze
  validates :status, inclusion: { in: STATUSES }

  validate :time_presence
  validate :prevent_overlapping_bookings
  validate :status_transition_rules
  validate :require_customer_name
  validate :require_booking_item_for_confirmed

  # --- Compatibility helpers (supports starts_at/ends_at OR start_at/end_at) ---
  def start_time
    respond_to?(:starts_at) ? self[:starts_at] : self[:start_at]
  end

  def end_time
    respond_to?(:ends_at) ? self[:ends_at] : self[:end_at]
  end

  def duration_minutes
    return 0 unless start_time && end_time
    ((end_time - start_time) / 60).to_i
  end

  private

  def time_presence
    if Booking.column_names.include?("starts_at")
      errors.add(:starts_at, "can't be blank") if self[:starts_at].blank?
      errors.add(:ends_at, "can't be blank") if self[:ends_at].blank?
    else
      errors.add(:start_at, "can't be blank") if self[:start_at].blank?
      errors.add(:end_at, "can't be blank") if self[:end_at].blank?
    end
  end

  def require_customer_name
    # If you want this required, enforce it always (you asked for customer enters name)
    if respond_to?(:customer_name) && customer_name.to_s.strip.blank?
      errors.add(:customer_name, "is required")
    end
  end

  def prevent_overlapping_bookings
    return if start_time.blank? || end_time.blank?
    return if status == "cancelled"

    start_col = Booking.column_names.include?("starts_at") ? "starts_at" : "start_at"
    end_col   = Booking.column_names.include?("ends_at")   ? "ends_at"   : "end_at"

    scope = Booking.where(business_id: business_id)
                   .where.not(id: id)
                   .where.not(status: "cancelled")

    # If staff_member_id exists AND this booking has a staff member,
    # then prevent overlap for that staff member (more accurate).
    if Booking.column_names.include?("staff_member_id") && staff_member_id.present?
      scope = scope.where(staff_member_id: staff_member_id)
    end

    overlaps = scope.where("#{start_col} < ? AND #{end_col} > ?", end_time, start_time).exists?
    errors.add(:base, "This time slot is no longer available. Please choose another time.") if overlaps
  end

  def status_transition_rules
    return unless saved_change_to_status?

    from, to = saved_change_to_status
    return if from.nil? # first set

    allowed =
      case from
      when "pending"   then %w[confirmed cancelled]
      when "confirmed" then %w[cancelled]
      when "cancelled" then [] # final
      else []
      end

    unless allowed.include?(to)
      errors.add(:status, "cannot change from #{from} to #{to}")
    end
  end

  def require_booking_item_for_confirmed
    return unless status == "confirmed"
    return unless respond_to?(:booking_items)
    return if booking_items.loaded? ? booking_items.any? : booking_items.exists?

    errors.add(:base, "Booking is missing service details (booking item).")
  end
end
