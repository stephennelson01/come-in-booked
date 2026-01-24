# app/controllers/businesses_controller.rb
class BusinessesController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create]

  def index
    @businesses = Business.limit(50)
  end

  def new
    @business = Business.new
  end

  def create
    @business = Business.new(
      business_params.merge(
        user: current_user,
        slug: params[:business][:name].to_s.parameterize
      )
    )

    if @business.save
      redirect_to @business
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @business = Business.find_by!(slug: params[:id])
    @services = @business.respond_to?(:services) ? @business.services.order(created_at: :desc) : []
  end

  private

  def business_params
    params.require(:business).permit(:name, :description, :logo_url, :cover_url)
  end
end
