class Business < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :partner, optional: true

  has_many :services, dependent: :destroy
  has_many :bookings, dependent: :destroy
  has_many :locations, dependent: :destroy
  has_many :staff_members, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  after_create :ensure_booking_defaults

  private

  def ensure_booking_defaults
    # Only auto-create for partner-owned businesses (merchant side)
    return unless partner_id.present?

    if respond_to?(:locations) && locations.none?
      attrs = {}
      attrs[:title]   = "Main location" if Location.column_names.include?("title")
      attrs[:name]    = "Main location" if Location.column_names.include?("name")
      attrs[:address] = "Address coming soon" if Location.column_names.include?("address")
      locations.create!(attrs.presence || {})
    end

    if respond_to?(:staff_members) && staff_members.none?
      attrs = {}
      attrs[:name] = "Default staff" if StaffMember.column_names.include?("name")
      staff_members.create!(attrs.presence || {})
    end
  rescue => e
    Rails.logger.warn("[BUSINESS] ensure_booking_defaults failed business_id=#{id} error=#{e.class}: #{e.message}")
  end
end
