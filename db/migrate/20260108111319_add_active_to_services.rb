class AddActiveToServices < ActiveRecord::Migration[7.1]
  def up
    add_column :services, :active, :boolean, default: true, null: false
  end

  def down
    remove_column :services, :active
  end
end
