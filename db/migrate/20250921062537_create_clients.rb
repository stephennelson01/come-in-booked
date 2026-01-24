class CreateClients < ActiveRecord::Migration[7.1]
  def change
    create_table :clients do |t|
      t.references :business, null: false, foreign_key: true
      t.references :user,     foreign_key: true
      t.string  :name,  null: false
      t.string  :email
      t.string  :phone
      t.boolean :marketing_opt_in, default: false
      t.timestamps
    end
    add_index :clients, [:business_id, :email]
    add_index :clients, [:business_id, :phone]
  end
end
