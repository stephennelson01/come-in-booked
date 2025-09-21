# db/migrate/XXXX_add_indexes.rb
class AddIndexes < ActiveRecord::Migration[7.1]
  def change
    add_index :businesses, :slug, unique: true
    add_index :locations, :geo, using: :gist
    add_index :locations, [:lat,:lng]
  end
end
