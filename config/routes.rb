Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  get '/puuid/:summoner_id', to: 'riot_api_fetch#puuid_from_summoner'
end
