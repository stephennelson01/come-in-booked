class CreateBookingItems < ActiveRecord::Migration[7.1]
  def change
    create_table :booking_items do |t|
      t.references :booking, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true
      t.references :staff_member, null: true, foreign_key: true

      t.integer :price_cents, null: false, default: 0
      t.integer :duration_minutes, null: false, default: 30

      t.timestamps
    end

    add_index :booking_items, [:booking_id, :service_id]
  end
end
