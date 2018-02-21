class DashboardController < ApplicationController

  before_action :authenticate_user!

  def home
    @active = "mine"
    @clocks = current_user.clocks
    if params[:clocks] == "mine" || params[:clocks] == nil
      @clocks = current_user.clocks
      @active = "mine"
    else
      @clocks = Clock.all
      @active = "all"
    end
  end

end
