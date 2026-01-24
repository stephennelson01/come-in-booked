class AllowNullStaffMemberOnBookings < ActiveRecord::Migration[7.1]
  def change
    change_column_null :bookings, :staff_member_id, true
  end
end
