class ClockController < ApplicationController

  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def create
    clock = current_user.clocks.new clock_params
    if clock.save
      # render json: {}, status: :created
      render json: { message: "success" }, status: 200
    else
      render json: { errors: clock.errors.full_messages }, status: 422
    end
  end

  def destroy
    clock = Clock.where(user_id: current_user.id, id: params[:id]).first
    if clock.nil?
      render json: { errors: "clock not found"}, status: 422
    else
      clock.destroy
      render json: { message: "success" }, status: 200
    end
  end

  private

  def clock_params
    params.require(:clock).permit(:place_id, :name, :formatted_name, :lat, :lon, :map_url)
  end

end
