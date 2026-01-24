# app/controllers/pages_controller.rb
class PagesController < ApplicationController
  def home; end
  def for_business; end
  def support; end
  def blog; end
  def browse; end
  def legal_privacy; end
  def legal_terms; end
  def status; end

  # chooser
  def user_flow; end

  # customers sign-in screen (UI only, posts to Devise)
  def customer_sign_in; end

  # partners auth placeholders (UI only for now)
  def partners_sign_in; end
  def partners_sign_up; end
end
