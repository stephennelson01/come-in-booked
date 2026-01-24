class CreateAvailabilityRules < ActiveRecord::Migration[7.1]
  def change
    create_table :availability_rules do |t|
      t.references :staff_member, null: false, foreign_key: true
      t.integer :weekday
      t.integer :from_minute
      t.integer :to_minute

      t.timestamps
    end
  end
end
