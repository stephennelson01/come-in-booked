class CreateServices < ActiveRecord::Migration[7.1]
  def change
    create_table :services do |t|
      t.references :business, null: false, foreign_key: true
      t.string  :name, null: false
      t.text    :description
      t.integer :price_cents, null: false
      t.integer :duration_min, null: false
      t.boolean :active, default: true

      t.timestamps
    end
  end
end
