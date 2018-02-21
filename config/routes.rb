Rails.application.routes.draw do
  devise_for :users

  get '/dashboard', to: 'dashboard#home'

  post   '/clock/create',     to: 'clock#create'
  delete '/clock/delete/:id',  to: 'clock#destroy'

  root 'dashboard#home'
end
