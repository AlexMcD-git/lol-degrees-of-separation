from flask import Flask
import cassiopeia as cass
from cassiopeia.data import Queue
from dotenv import load_dotenv
import os
import json

app = Flask(__name__)

load_dotenv()

cass.set_riot_api_key(os.getenv('RIOT_API_KEY'))

kalturi = cass.get_summoner(name="Kalturi", region="NA")
print(kalturi.id)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/initial-lookup/<name>")
def puuid_from_name(name):
    summoner = cass.get_summoner(name=name, region="NA")
    summonerData=json.loads(summoner.league_entries[Queue.ranked_solo_fives].to_json())
    summonerData['puuid']=summoner.puuid
    return json.dumps(summonerData)

@app.route("/best-from-recent-games/<puuid>")
def matches_from_puuid(puuid):
    matches=cass.get_match_history(puuid=puuid, count=10, queue=cass.Queue.ranked_solo_fives, continent=cass.Region.north_america.continent)
    thingy=[[json.loads(participant.to_json()) for participant in match.participants] for match in matches]
    names=list(set(sum([[participant["summonerName"] for participant in matches] for matches in thingy],start=[])))
    # names=['projectmexican', 
    # 'Egrillionyal', 
    # 'BigBongRip', 
    # 'CrackBracelet', 
    # 'A Furry Smurf', 
    # 'Pizza Pie Guy 23', 
    # 'TicTacTfree', 
    # 'BlackTeaCups', 
    # 'Stylz Hazweed']

    allSoloFivesInfo=[]
    for name in names:
        try:
            summoner=cass.Summoner(name=name, region="NA")
            soloFivesData= json.loads(summoner.league_entries[Queue.ranked_solo_fives].to_json())
            allSoloFivesInfo.append(soloFivesData)

        except Exception as e:
            print(e)
    print (allSoloFivesInfo)
    rankedTiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD','PLATINUM', 'DIAMOND', 'MASTER','GRANDMASTER','CHALLENGER']
    rankedDivision = ['IV', 'III', 'II', 'I']
    allSoloFivesInfo.sort(reverse = True, key=lambda x: (rankedTiers.index(x['tier']), rankedDivision.index(x['division']), x['leaguePoints']))
    bestPlayer=allSoloFivesInfo[0]
    #saves looking up puuid for all players
    bestPlayer['puuid']= cass.get_summoner(id=bestPlayer['summonerId'], region="NA").puuid
    return json.dumps(bestPlayer)