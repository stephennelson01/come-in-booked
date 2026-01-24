# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_01_24_090831) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "btree_gin"
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "availability_rules", force: :cascade do |t|
    t.bigint "staff_member_id", null: false
    t.integer "weekday"
    t.integer "from_minute"
    t.integer "to_minute"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["staff_member_id"], name: "index_availability_rules_on_staff_member_id"
  end

  create_table "blackouts", force: :cascade do |t|
    t.bigint "staff_member_id", null: false
    t.datetime "starts_at"
    t.datetime "ends_at"
    t.string "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["staff_member_id"], name: "index_blackouts_on_staff_member_id"
  end

  create_table "booking_items", force: :cascade do |t|
    t.bigint "booking_id", null: false
    t.bigint "service_id", null: false
    t.integer "duration_min", default: 30, null: false
    t.integer "price_cents", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_booking_items_on_booking_id"
    t.index ["service_id"], name: "index_booking_items_on_service_id"
  end

  create_table "bookings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "business_id", null: false
    t.bigint "location_id", null: false
    t.bigint "staff_member_id"
    t.string "status", default: "confirmed", null: false
    t.string "source", default: "direct", null: false
    t.text "notes"
    t.datetime "starts_at", null: false
    t.datetime "ends_at", null: false
    t.boolean "no_show_flag", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "customer_name"
    t.datetime "read_by_partner_at"
    t.index ["business_id", "starts_at"], name: "index_bookings_on_business_id_and_starts_at"
    t.index ["business_id"], name: "index_bookings_on_business_id"
    t.index ["location_id"], name: "index_bookings_on_location_id"
    t.index ["staff_member_id", "starts_at"], name: "index_bookings_on_staff_member_id_and_starts_at"
    t.index ["staff_member_id"], name: "index_bookings_on_staff_member_id"
    t.index ["starts_at"], name: "index_bookings_on_starts_at"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "businesses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "logo_url"
    t.string "cover_url"
    t.jsonb "policies_json", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "partner_id", null: false
    t.index ["partner_id"], name: "index_businesses_on_partner_id"
    t.index ["slug"], name: "index_businesses_on_slug", unique: true
    t.index ["user_id"], name: "index_businesses_on_user_id"
  end

  create_table "clients", force: :cascade do |t|
    t.bigint "business_id", null: false
    t.bigint "user_id"
    t.string "name", null: false
    t.string "email"
    t.string "phone"
    t.boolean "marketing_opt_in", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["business_id", "email"], name: "index_clients_on_business_id_and_email"
    t.index ["business_id", "phone"], name: "index_clients_on_business_id_and_phone"
    t.index ["business_id"], name: "index_clients_on_business_id"
    t.index ["user_id"], name: "index_clients_on_user_id"
  end

  create_table "locations", force: :cascade do |t|
    t.bigint "business_id", null: false
    t.string "address"
    t.string "line2"
    t.string "city"
    t.string "region"
    t.string "country"
    t.string "postal_code"
    t.string "tz"
    t.string "phone"
    t.float "lat"
    t.float "lng"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.geography "geo", limit: {:srid=>4326, :type=>"st_point", :geographic=>true}
    t.geometry "geom", limit: {:srid=>4326, :type=>"st_point"}
    t.index ["business_id"], name: "index_locations_on_business_id"
    t.index ["geo"], name: "idx_locations_geo_gist", using: :gist
    t.index ["geom"], name: "idx_locations_geom_gist", using: :gist
  end

  create_table "partners", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_partners_on_email", unique: true
    t.index ["reset_password_token"], name: "index_partners_on_reset_password_token", unique: true
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "booking_id", null: false
    t.integer "amount_cents"
    t.string "status"
    t.string "method"
    t.string "processor_charge_id"
    t.string "processor_payment_intent_id"
    t.string "processor_setup_intent_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_payments_on_booking_id"
  end

  create_table "services", force: :cascade do |t|
    t.bigint "business_id", null: false
    t.string "name", null: false
    t.string "category"
    t.integer "duration_min", default: 30, null: false
    t.integer "price_cents", default: 0, null: false
    t.integer "deposit_cents", default: 0, null: false
    t.boolean "add_on", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active"
    t.text "description"
    t.index ["business_id", "category"], name: "index_services_on_business_id_and_category"
    t.index ["business_id"], name: "index_services_on_business_id"
  end

  create_table "staff_members", force: :cascade do |t|
    t.bigint "business_id", null: false
    t.bigint "user_id", null: false
    t.string "name"
    t.text "bio"
    t.string "roles"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["business_id"], name: "index_staff_members_on_business_id"
    t.index ["user_id"], name: "index_staff_members_on_user_id"
  end

  create_table "staff_services", force: :cascade do |t|
    t.bigint "staff_member_id", null: false
    t.bigint "service_id", null: false
    t.integer "price_override_cents"
    t.integer "duration_override_min"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["service_id"], name: "index_staff_services_on_service_id"
    t.index ["staff_member_id", "service_id"], name: "index_staff_services_on_staff_member_id_and_service_id", unique: true
    t.index ["staff_member_id"], name: "index_staff_services_on_staff_member_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", default: "consumer", null: false
    t.string "stripe_customer_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "availability_rules", "staff_members"
  add_foreign_key "blackouts", "staff_members"
  add_foreign_key "booking_items", "bookings"
  add_foreign_key "booking_items", "services"
  add_foreign_key "bookings", "businesses"
  add_foreign_key "bookings", "locations"
  add_foreign_key "bookings", "staff_members"
  add_foreign_key "bookings", "users"
  add_foreign_key "businesses", "partners"
  add_foreign_key "businesses", "users"
  add_foreign_key "clients", "businesses"
  add_foreign_key "clients", "users"
  add_foreign_key "locations", "businesses"
  add_foreign_key "payments", "bookings"
  add_foreign_key "services", "businesses"
  add_foreign_key "staff_members", "businesses"
  add_foreign_key "staff_members", "users"
  add_foreign_key "staff_services", "services"
  add_foreign_key "staff_services", "staff_members"
end
