class VenuesController < ApplicationController
  before_action :set_business

  def show
    # later: photos, reviews, etc.
  end

  def services
    @services = @business.services.active.order(:category, :name)
  end

  private

  def set_business
    @business = Business.find_by!(slug: params[:slug])
  end
end
