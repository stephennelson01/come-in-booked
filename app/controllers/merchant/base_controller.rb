module Merchant
  class BaseController < ApplicationController
    before_action :authenticate_partner!
    layout "merchant"

    private

    # Best-effort current business resolution (prevents nil crashes)
    def current_business
      # if Partner has business_id column
      if current_partner.respond_to?(:business_id) && current_partner.business_id.present?
        return Business.find_by(id: current_partner.business_id)
      end

      # if Business has user_id owner that matches partner (common early-stage)
      if Business.column_names.include?("user_id")
        b = Business.find_by(user_id: current_partner.id)
        return b if b
      end

      # fallback to first business (dev mode)
      Business.first
    end
    helper_method :current_business
  end
end
