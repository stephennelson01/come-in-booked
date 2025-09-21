class CreateBusinesses < ActiveRecord::Migration[7.1]
  def change
    create_table :businesses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :slug
      t.text :description
      t.string :logo_url
      t.string :cover_url
      t.jsonb :policies_json

      t.timestamps
    end
  end
end
