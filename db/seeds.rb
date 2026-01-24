# Users
admin = User.find_or_create_by!(email: "admin@example.com") do |u|
  u.password = "password"
  u.role = "admin"
end

owner = User.find_or_create_by!(email: "owner@example.com") do |u|
  u.password = "password"
  u.role = "owner"
end

consumer = User.find_or_create_by!(email: "user@example.com") do |u|
  u.password = "password"
  u.role = "consumer"
end

# Business
biz = Business.find_or_create_by!(slug: "sample-barber") do |b|
  b.user = owner
  b.name = "Sample Barber"
  b.description = "Crisp fades & line-ups"
  b.logo_url = nil
  b.cover_url = nil
  b.policies_json = {}
end

# Location
Location.find_or_create_by!(business: biz, address: "10 King Street", city: "Manchester") do |loc|
  loc.region = "Greater Manchester"
  loc.country = "GB"
  loc.postal_code = "M2"
  loc.tz = "Europe/London"
  loc.phone = "+44 0000 000000"
  loc.lat = 53.4808
  loc.lng = -2.2426
end
