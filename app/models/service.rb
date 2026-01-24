class Service < ApplicationRecord
  belongs_to :business

  # Image upload (merchant uploads, customers see it)
  has_one_attached :image

  # Optional: simple validations
  validates :name, presence: true
  validates :price_cents, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :duration_min, numericality: { greater_than: 0 }, allow_nil: true

  # Optional helper
  def price_display(currency: "£")
    return "" if price_cents.nil?
    "#{currency}#{format('%.2f', price_cents.to_i / 100.0)}"
  end
end
