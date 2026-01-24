# app/controllers/search_controller.rb
class SearchController < ApplicationController
  def index
    q = params[:q].to_s.strip

    scope = Service.all

    # Only filter by active if that column exists
    scope = scope.where(active: true) if Service.column_names.include?("active")

    # Keyword search
    if q.present?
      like = "%#{q}%"
      if Service.column_names.include?("description")
        scope = scope.where("services.name ILIKE :q OR services.description ILIKE :q", q: like)
      else
        scope = scope.where("services.name ILIKE :q", q: like)
      end
    end

    # Eager load safely (no breakage if associations/attachments aren't wired yet)
    includes_args = []
    includes_args << :business if Service.reflect_on_association(:business)

    # Only preload ActiveStorage if Service has has_one_attached :image (=> image_attachment exists)
    if Service.reflect_on_association(:image_attachment)
      includes_args << { image_attachment: :blob }
    end

    scope = scope.includes(*includes_args) if includes_args.any?

    @services = scope.order(created_at: :desc).limit(60)
  end
end
