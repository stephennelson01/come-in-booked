class CreateBlackouts < ActiveRecord::Migration[7.1]
  def change
    create_table :blackouts do |t|
      t.references :staff_member, null: false, foreign_key: true
      t.datetime :starts_at
      t.datetime :ends_at
      t.string :reason

      t.timestamps
    end
  end
end
