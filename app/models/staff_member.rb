class StaffMember < ApplicationRecord
  belongs_to :business
  belongs_to :user
  has_many :availability_rules, dependent: :destroy
  has_many :blackouts, dependent: :destroy
end
