class LocationsController < ApplicationController
  def nearby
    lat = params[:lat]&.to_f
    lng = params[:lng]&.to_f
    radius = (params[:radius_km] || 5).to_f

    if lat && lng
      @locations = Location.near_point(lat, lng, radius).limit(200)
    else
      # fallback: show newest or popular; for now show all limited
      @locations = Location.limit(50)
    end

    respond_to do |format|
      format.html # renders a simple page we’ll make below
      format.json { render json: @locations.as_json(only: [:id, :address, :city, :lat, :lng, :phone], methods: [:distance_m]) }
    end
  end
end
