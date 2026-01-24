class SlotFinder
  SLOT_MIN = 5

  def initialize(staff:, service:, date:, location:)
    @staff, @service, @date, @location = staff, service, date, location
  end

  def slots
    wday = @date.wday
    rules = @staff.availability_rules.where(weekday: wday)
    return [] if rules.empty?

    busy = Booking.where(staff_member: @staff, location: @location)
                  .where(starts_at: @date.beginning_of_day..@date.end_of_day)
                  .pluck(:starts_at, :ends_at)

    blocks = @staff.blackouts.where("starts_at < ? AND ends_at > ?", @date.end_of_day, @date.beginning_of_day)
                    .pluck(:starts_at, :ends_at)

    occupied = (busy + blocks).map { |s,e| (s.to_i...e.to_i) }.to_a

    rules.flat_map do |r|
      day_start = @date.change(hour: r.from_minute/60, min: r.from_minute%60)
      day_end   = @date.change(hour: r.to_minute/60,   min: r.to_minute%60)
      step = SLOT_MIN.minutes
      dur  = @service.duration_for(@staff).minutes

      slots = []
      t = day_start
      while t + dur <= day_end
        span = (t.to_i... (t + dur).to_i)
        free = occupied.none? { |rng| overlaps?(rng, span) }
        slots << t if free
        t += step
      end
      slots
    end.sort
  end

  private
  def overlaps?(rng, span)
    (rng.begin < span.end) && (span.begin < rng.end)
  end
end
