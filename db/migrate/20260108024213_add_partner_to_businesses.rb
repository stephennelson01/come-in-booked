class AddPartnerToBusinesses < ActiveRecord::Migration[7.1]
  def change
    add_reference :businesses, :partner, null: true, foreign_key: true
  end
end
