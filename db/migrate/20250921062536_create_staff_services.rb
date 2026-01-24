class CreateStaffServices < ActiveRecord::Migration[7.1]
  def change
    create_table :staff_services do |t|
      t.references :staff_member, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true
      t.timestamps
    end

    add_index :staff_services, [:staff_member_id, :service_id], unique: true
  end
end
