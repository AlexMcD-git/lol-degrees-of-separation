Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  get '/puuid/:summoner_id', to: 'riot_api_fetch#puuid_from_summoner'
  get '/matches/:puuid', to: 'riot_api_fetch#matches_from_puuid'
  get '/match/:match_id', to: 'riot_api_fetch#match_from_match_id'
  get '/rankedInfo/:puuid', to: 'riot_api_fetch#ranked_info_from_puuid'
end
