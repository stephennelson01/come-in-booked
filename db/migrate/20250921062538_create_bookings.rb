class CreateBookings < ActiveRecord::Migration[7.1]
  def change
    create_table :bookings do |t|
      t.references :business, null: false, foreign_key: true
      t.references :location, null: false, foreign_key: true
      t.references :user,     null: false, foreign_key: true
      t.references :staff_member, null: true, foreign_key: true

      t.datetime :start_at, null: false
      t.datetime :end_at,   null: false

      t.string  :status, null: false, default: "pending"
      t.string  :currency, null: false, default: "GBP"
      t.integer :total_cents, null: false, default: 0
      t.integer :deposit_cents, null: false, default: 0
      t.text    :notes

      t.timestamps
    end

    add_index :bookings, [:business_id, :start_at]
    add_index :bookings, [:location_id, :start_at]
    add_index :bookings, [:user_id, :start_at]
  end
end
