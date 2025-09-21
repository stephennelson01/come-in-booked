class CreateBusinesses < ActiveRecord::Migration[7.1]
  def change
    create_table :businesses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.string :logo_url
      t.string :cover_url
      t.jsonb :policies_json, default: {}

      t.timestamps
    end

    add_index :businesses, :slug, unique: true
  end
end
