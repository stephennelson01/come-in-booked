class DirectoryController < ApplicationController
  def country
    @country = params[:country_slug].to_s.tr("-", " ").titleize
  end

  def city
    @country = params[:country_slug].to_s.tr("-", " ").titleize
    @city    = params[:city_slug].to_s.tr("-", " ").titleize
  end

  def category
    @country  = params[:country_slug].to_s.tr("-", " ").titleize
    @city     = params[:city_slug].to_s.tr("-", " ").titleize
    @category = params[:category].to_s.tr("-", " ").titleize
  end
end
