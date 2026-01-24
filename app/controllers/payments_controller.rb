class PaymentsController < ApplicationController
  before_action :set_booking

  def create_deposit
    amount = (@booking.booking_items.sum(:price_cents) - @booking.booking_items.sum(:price_cents) + @booking.booking_items.sum(:price_cents)) # placeholder
    amount = @booking.booking_items.sum(:price_cents) # deposit could be service.deposit_cents; adjust as needed

    pi = Stripe::PaymentIntent.create(
      amount: amount,
      currency: "gbp",
      customer: stripe_customer_id_for(current_user),
      automatic_payment_methods: { enabled: true },
      metadata: { booking_id: @booking.id }
    )

    Payment.create!(booking: @booking, amount_cents: amount, status: "processing", processor_payment_intent_id: pi.id, method: "card")
    render json: { client_secret: pi.client_secret }
  end

  private
  def set_booking; @booking = Booking.find(params[:booking_id]); end

  def stripe_customer_id_for(user)
    # TODO: persist on User; for now create on the fly
    user.update!(stripe_customer_id: Stripe::Customer.create(email: user.email).id) unless user.respond_to?(:stripe_customer_id) && user.stripe_customer_id.present?
    user.stripe_customer_id
  end
end
