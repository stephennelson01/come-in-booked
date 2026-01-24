Rails.application.routes.draw do
  root "pages#home"

  # -------------------------
  # Customers (Devise: User)
  # -------------------------
  devise_for :users, path: "customers", path_names: {
    sign_in: "sign-in",
    sign_out: "sign-out",
    sign_up: "sign-up"
  }

  devise_scope :user do
    get    "customers/sign-in",  to: "devise/sessions#new",     as: :customers_sign_in
    post   "customers/sign-in",  to: "devise/sessions#create",  as: :customers_sign_in_submit
    delete "customers/sign-out", to: "devise/sessions#destroy", as: :customers_sign_out
  end

  # -------------------------
  # Partners (Devise: Partner)
  # -------------------------
  devise_for :partners, path: "partners", path_names: {
    sign_in: "sign-in",
    sign_out: "sign-out",
    sign_up: "sign-up"
  }

  devise_scope :partner do
    get    "partners/sign-in",   to: "partners/sessions#new",          as: :partners_sign_in
    post   "partners/sign-in",   to: "partners/sessions#create",       as: :partners_sign_in_submit
    delete "partners/sign-out",  to: "partners/sessions#destroy",      as: :partners_sign_out

    get    "partners/sign-up",   to: "partners/registrations#new",     as: :partners_sign_up
    post   "partners/sign-up",   to: "partners/registrations#create", as: :partners_sign_up_submit
  end

  # Auth chooser
  get "/user-flow", to: "pages#user_flow", as: :user_flow

  # -------------------------
  # Customer dashboard + bookings
  # -------------------------
  namespace :customer do
    root "dashboard#index"
    resources :bookings, only: %i[index show new create] do
      post :rebook, on: :member
    end
  end

  # -------------------------
  # Merchant dashboard
  # -------------------------
  namespace :merchant do
    root "dashboard#index", as: :root
    get "/dashboard", to: "dashboard#index"

    resources :services

    # Calendar
    get "/calendar", to: "calendar#index", as: :calendar

    # Booking inbox
    resources :bookings, only: %i[index show]
  end

  # Businesses (public pages)
  resources :businesses, only: %i[index new create show]

  # Marketing / footer links
  get "/for-business",  to: "pages#for_business",  as: :for_business
  get "/support",       to: "pages#support",       as: :support
  get "/blog",          to: "pages#blog",          as: :blog
  get "/browse",        to: "pages#browse",        as: :browse
  get "/status",        to: "pages#status",        as: :status
  get "/legal/privacy", to: "pages#legal_privacy", as: :legal_privacy
  get "/legal/terms",   to: "pages#legal_terms",   as: :legal_terms

  # Search
  get "/search", to: "search#index", as: :search
end
