class RiotApiFetchController < ApplicationController

    require 'rest-client'
    require 'erb'
    include ERB::Util

    def puuid_from_summoner
        riot_api_key = ENV['RIOT_API_KEY']
        summoner=summoner_params
        response = RestClient.get('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+url_encode(summoner[:summoner_id])+'?api_key='+riot_api_key, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        })
        render json: response
    end

    def matches_from_puuid
        riot_api_key = ENV['RIOT_API_KEY']
        puuid = puuid_params
        response = RestClient.get('https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/'+puuid[:puuid]+'/ids?queue=420&type=ranked&start=0&count=10&api_key='+riot_api_key, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        })
        render json: response
    end

    def match_from_match_id
        riot_api_key = ENV['RIOT_API_KEY']
        match=match_params
        response = RestClient.get('https://americas.api.riotgames.com/lol/match/v5/matches/'+match[:match_id]+'?api_key='+riot_api_key, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        })
        render json: response
    end

    def ranked_info_from_puuid
        riot_api_key = ENV['RIOT_API_KEY']
        puuid = puuid_params
        response1= RestClient.get('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/'+puuid[:puuid]+'?api_key='+riot_api_key, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        })
        response_1_parse=JSON.parse(response1)
        puts response_1_parse
        response2= RestClient.get('https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+response_1_parse["id"]+'?api_key='+riot_api_key, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com"
        })
        puts response2
        render json: response2
    end



    private
    def summoner_params
        params.permit(:summoner_id)
    end
    def puuid_params
        params.permit(:puuid)
    end
    def match_params
        params.permit(:match_id)
    end
end
