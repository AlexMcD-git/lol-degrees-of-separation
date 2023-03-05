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

@app.route("/puuid/<name>")
def puuid_from_name(name):
    summoner = cass.get_summoner(name=name, region="NA")
    return {'puuid': summoner.puuid}

@app.route("/matches/<puuid>")
def matches_from_puuid(puuid):
    # matches=cass.get_match_history(puuid=puuid, count=10, queue=cass.Queue.ranked_solo_fives, continent=cass.Region.north_america.continent)
    # thingy=[[json.loads(participant.to_json()) for participant in match.participants] for match in matches]
    # names=list(set(sum([[participant["summonerName"] for participant in matches] for matches in thingy],start=[])))
    names=[
"dundiseris",
"FenisDeleter",
"Antonellayg",
"mynameisdamn",
"fishstixz",
"kaynis1",
"xKratosx",
"Canucklehead86",
"peiliang ",
"falserara",
]

    allSoloQueueInfo=[]
    for name in names:
        try:
            summoner=cass.Summoner(name=name, region="NA")
            # league = summoner.ranks[cass.Queue.ranked_solo_fives]
            # print(league.divison, league.tier)
            entries = []
            test= [summoner.league_entries[cass.Queue.ranked_solo_fives]]
            print(test.to_json())
            #if queue is solo 5v5 add to dict
            entries.append(test)
            
            print(test)
        except Exception as e:
            print(e)
    return allSoloQueueInfo
    # rankedTiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD','PLATINUM', 'DIAMOND', 'MASTER','GRANDMASTER','CHALLENGER']
    # rankedRanks = ['IV', 'III', 'II', 'I']
    # allSoloQueueInfo.sort(key=lambda x: (rankedTiers.index(x['tier']), rankedRanks.index(x.rank), x.leaguePoints))