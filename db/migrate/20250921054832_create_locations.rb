class CreateLocations < ActiveRecord::Migration[7.1]
  def change
    create_table :locations do |t|
      t.references :business, null: false, foreign_key: true
      t.string :address
      t.string :line2
      t.string :city
      t.string :region
      t.string :country
      t.string :postal_code
      t.string :tz
      t.string :phone
      t.float :lat
      t.float :lng

      t.timestamps
    end
  end
end
