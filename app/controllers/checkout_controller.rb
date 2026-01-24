class CheckoutController < ApplicationController
  protect_from_forgery except: [:details, :payment]

  def start
    @venue_id = params[:venue_id]
  end

  def details
    # Collect customer details; persist to session/Booking (stub)
    redirect_to action: :payment
  end

  def payment
    # Stripe Elements would mount here later
  end

  def success
  end
end
