class StaffService < ApplicationRecord
  belongs_to :staff_member
  belongs_to :service

  validates :service_id, uniqueness: { scope: :staff_member_id }
end
