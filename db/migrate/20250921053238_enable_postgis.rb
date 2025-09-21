class EnablePostgis < ActiveRecord::Migration[7.1]
  def change
    enable_extension "postgis"
    enable_extension "btree_gin"
  end
end
