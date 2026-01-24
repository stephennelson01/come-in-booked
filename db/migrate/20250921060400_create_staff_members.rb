class CreateStaffMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :staff_members do |t|
      t.references :business, null: false, foreign_key: true
      t.references :user, foreign_key: true
      t.string :name, null: false
      t.text :bio
      t.string :roles
      t.timestamps
    end
  end
end
