class Location < ApplicationRecord
  belongs_to :business
  validates :lat, :lng, presence: true

  before_save :sync_geo

  scope :near_point, ->(lat, lng, radius_km = 5) {
    point_wkt = "SRID=4326;POINT(#{lng} #{lat})"
    where("ST_DWithin(geo, ST_GeogFromText(?), ?)", point_wkt, (radius_km * 1000).to_i)
      .select("locations.*, ST_Distance(geo, ST_GeogFromText('#{point_wkt}')) AS distance_m")
      .order("distance_m ASC")
  }

  private
  def sync_geo
    if will_save_change_to_lat? || will_save_change_to_lng? || geo.nil?
      self.geo = "POINT(#{lng} #{lat})"
    end
  end
end
