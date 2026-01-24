module Users
  class SessionsController < Devise::SessionsController
    # Use a partners marketing layout for the sign-in page
    layout :determine_layout

    private

    def determine_layout
      # Use partners layout only for the sign-in form (HTML)
      action_name == "new" ? "partners" : "application"
    end
  end
end
