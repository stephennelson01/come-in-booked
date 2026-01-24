class AddGeoColumnsToLocations < ActiveRecord::Migration[7.1]
  def up
    execute "ALTER TABLE locations ADD COLUMN IF NOT EXISTS geo  geography(Point,4326);"
    execute "ALTER TABLE locations ADD COLUMN IF NOT EXISTS geom geometry(Point,4326);"

    execute "CREATE INDEX IF NOT EXISTS idx_locations_geo_gist  ON locations USING GIST (geo);"
    execute "CREATE INDEX IF NOT EXISTS idx_locations_geom_gist ON locations USING GIST (geom);"

    execute <<~SQL
      UPDATE locations
      SET
        geo  = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
        geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
      WHERE lat IS NOT NULL AND lng IS NOT NULL
        AND (geo IS NULL OR geom IS NULL);
    SQL
  end

  def down
    execute "DROP INDEX IF EXISTS idx_locations_geo_gist;"
    execute "DROP INDEX IF EXISTS idx_locations_geom_gist;"
    execute "ALTER TABLE locations DROP COLUMN IF EXISTS geo;"
    execute "ALTER TABLE locations DROP COLUMN IF EXISTS geom;"
  end
end
