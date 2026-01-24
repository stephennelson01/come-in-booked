class EnforcePartnerNotNullOnBusinesses < ActiveRecord::Migration[7.1]
  def change
    change_column_null :businesses, :partner_id, false
  end
end
