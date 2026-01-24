# app/services/sms.rb
class Sms
  def self.send(to:, body:)
    client = Twilio::REST::Client.new(ENV["TWILIO_ACCOUNT_SID"], ENV["TWILIO_AUTH_TOKEN"])
    client.messages.create(from: ENV["TWILIO_FROM"], to: to, body: body)
  end
end
