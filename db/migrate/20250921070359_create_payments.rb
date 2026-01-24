class CreatePayments < ActiveRecord::Migration[7.1]
  def change
    create_table :payments do |t|
      t.references :booking, null: false, foreign_key: true
      t.integer :amount_cents
      t.string :status
      t.string :method
      t.string :processor_charge_id
      t.string :processor_payment_intent_id
      t.string :processor_setup_intent_id

      t.timestamps
    end
  end
end
