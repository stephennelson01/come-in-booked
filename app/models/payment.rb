class Payment < ApplicationRecord
  belongs_to :booking
  STATUSES = %w[requires_action processing succeeded failed canceled].freeze
end
