# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  protected

  def after_sign_in_path_for(resource)
    return merchant_root_path if resource.is_a?(Partner)
    super
  end
end
