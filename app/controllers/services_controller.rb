class ServicesController < ApplicationController
  # Read-only timeslots (simple stub that works)
  def availability
    service = Service.find(params[:id])

    date = begin
      Date.parse(params[:date].to_s)
    rescue ArgumentError
      Date.current
    end

    slots = build_slots(date, step_minutes: 30, start_hour: 9, end_hour: 18)

    render json: {
      service_id: service.id,
      date: date.iso8601,
      slots: slots.map { |t| t.iso8601 }
    }
  end

  private

  def build_slots(date, step_minutes:, start_hour:, end_hour:)
    start_time = Time.zone.local(date.year, date.month, date.day, start_hour, 0)
    end_time   = Time.zone.local(date.year, date.month, date.day, end_hour, 0)

    slots = []
    t = start_time
    while t < end_time
      slots << t
      t += step_minutes.minutes
    end
    slots
  end
end
