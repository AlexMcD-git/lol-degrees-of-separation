class RiotApiFetchController < ApplicationController

    require 'rest-client'
    def puuid_from_summoner
        riot_api_key = ENV['RIOT_API_KEY']
        summoner=summoner_params
        response = RestClient.get('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+summoner[:summoner_id], headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com",
            "X-Riot-Token": riot_api_key
        })
        render json: response
    end


    private
    def summoner_params
        params.permit(:summoner_id)
    end
end
