# app/helpers/application_helper.rb
module ApplicationHelper
  # Works in dev (assets.compile = true) and production (manifest)
  def asset_exists?(logical_path)
    if Rails.application.config.assets.compile
      Rails.application.assets&.find_asset(logical_path).present?
    else
      m = Rails.application.assets_manifest
      m && m.assets && m.assets[logical_path].present?
    end
  end

  def image_url_or_nil(logical_path)
    asset_exists?(logical_path) ? image_path(logical_path) : nil
  end
end
