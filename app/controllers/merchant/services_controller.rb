module Merchant
  class ServicesController < ApplicationController
    layout "merchant"

    before_action :authenticate_partner!
    before_action :set_business
    before_action :set_service, only: %i[show edit update destroy]

    def index
      @services = @business.services.order(created_at: :desc)
    end

    def show; end

    def new
      @service = @business.services.new(active: true)
    end

    def create
      @service = @business.services.new(service_params)
      @service.active = true if @service.has_attribute?(:active) && @service.active.nil?

      if @service.save
        redirect_to merchant_services_path, notice: "Service created."
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit; end

    def update
      if @service.update(service_params)
        redirect_to merchant_services_path, notice: "Service updated."
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @service.destroy
      redirect_to merchant_services_path, notice: "Service deleted."
    end

    private

    def set_business
      @business = Business.where(partner_id: current_partner.id).order(created_at: :asc).first

      unless @business
        redirect_to for_business_path, alert: "Create your business first."
      end
    end

    def set_service
      @service = @business.services.find(params[:id])
    end

    def service_params
      permitted = [:name, :price_cents, :duration_min]
      permitted << :description if Service.column_names.include?("description")
      permitted << :active if Service.column_names.include?("active")
      permitted << :image

      params.require(:service).permit(*permitted)
    end
  end
end
