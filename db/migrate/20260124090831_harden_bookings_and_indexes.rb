class HardenBookingsAndIndexes < ActiveRecord::Migration[7.1]
  def change
    # -----------------------------
    # Add read-receipt for merchants
    # -----------------------------
    add_column :bookings, :read_by_partner_at, :datetime unless column_exists?(:bookings, :read_by_partner_at)

    # -----------------------------
    # Default status (safe)
    # -----------------------------
    if column_exists?(:bookings, :status)
      change_column_default :bookings, :status, from: nil, to: "confirmed"
      change_column_null :bookings, :status, false, "confirmed" rescue nil
    end

    # -----------------------------
    # Indexes (performance)
    # -----------------------------
    add_index :bookings, :user_id unless index_exists?(:bookings, :user_id)
    add_index :bookings, :business_id unless index_exists?(:bookings, :business_id)

    # Support either starts_at or start_at
    if column_exists?(:bookings, :starts_at)
      add_index :bookings, :starts_at unless index_exists?(:bookings, :starts_at)
    elsif column_exists?(:bookings, :start_at)
      add_index :bookings, :start_at unless index_exists?(:bookings, :start_at)
    end

    add_index :booking_items, :booking_id unless index_exists?(:booking_items, :booking_id)
    add_index :services, :business_id unless index_exists?(:services, :business_id)

    # businesses.slug unique at DB-level (deploy-safe)
    if column_exists?(:businesses, :slug) && !index_exists?(:businesses, :slug, unique: true)
      add_index :businesses, :slug, unique: true
    end
  end
end
