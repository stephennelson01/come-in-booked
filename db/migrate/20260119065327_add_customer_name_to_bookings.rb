class AddCustomerNameToBookings < ActiveRecord::Migration[7.1]
  def change
    add_column :bookings, :customer_name, :string
  end
end
