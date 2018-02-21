class ApplicationController < ActionController::Base

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_google_key
  protect_from_forgery with: :exception

  protected

  def set_google_key
    @google_api_key = "AIzaSyAKuipdbHdUBDNXH2bIoUycBfjmaRnDEv0"
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:timezone, :name])
  end

end
