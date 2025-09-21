class AddIndexes < ActiveRecord::Migration[7.1]
  def change
    if table_exists?(:businesses) && !index_exists?(:businesses, :slug)
      add_index :businesses, :slug, unique: true
    end

    if table_exists?(:locations) && !index_exists?(:locations, [:lat, :lng])
      add_index :locations, [:lat, :lng]
    end
  end
end
