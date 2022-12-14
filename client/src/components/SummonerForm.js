import React, { useState } from 'react'

function SummonerForm() {
    const [summonerName, setSummonerName] = useState('')
    const [summonerPuuid, setSummonerPuuid] = useState('')
    const [playerPath, setPlayerPath] = useState([])
    let matchData = []
    const playerListPuuid = new Set()
    let rankedInfo = []

    function summonerLookup(name) {
      fetch(`/puuid/${name}`)
      .then(r=>r.json())
      .then(data=>{
        setSummonerPuuid(data.puuid)
        findChallenger(data.puuid)
      }
      )
    }
    const tiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD','PLATINUM', 'DIAMOND', 'MASTER','GRANDMASTER','CHALLENGER'];
    const ranks = ['IV', 'III', 'II', 'I'];
    //this gets 429s from the rate limit
    // function findChallenger(puuid){
    //   fetch(`/matches/${puuid}`)
    //     .then(r=>r.json())
    //     .then(matches=>{matches.forEach(match=>{
    //       fetch(`/match/${match}`)
    //       .then(r=>r.json())
    //       .then(data=>{
    //         matchData.push(data)
    //         console.log(matchData)
    //         if (matchData.length === 10){
    //           //thing to do after all 10 match lookups are done
    //           matchData.forEach(match =>{
    //             match.metadata.participants.forEach(participant => playerListPuuid.add(participant))
    //           })
    //           let playerListPuuidArray = [...playerListPuuid]

    //           playerListPuuidArray.forEach(puuid=>{
    //             fetch(`/rankedInfo/${puuid}`)
    //             .then(r=>r.json())
    //             .then(data=>{
    //               data[0].queueType==="RANKED_SOLO_5x5"?rankedInfo.push(data[0]):rankedInfo.push(data[1])
    //               console.log(rankedInfo)
    //             })
    //           })
    //         }
    //       })
    //     })
    //   });
    // }
    function findChallenger(puuid) {
      fetch(`/matches/${puuid}`)
        .then(r => r.json())
        .then(matches => {
          let index = 0;
          function processMatch() {
            if (index === matches.length) {
              return;
            }
    
            fetch(`/match/${matches[index]}`)
              .then(r => r.json())
              .then(data => {
                matchData.push(data);
                console.log(matchData)
                if (matchData.length === 10) {
                  matchData.forEach(match => {
                    match.metadata.participants.forEach(participant => playerListPuuid.add(participant));
                  });
                  let playerListPuuidArray = [...playerListPuuid];
    
                  let rankedInfoIndex = 0;
                  function processPlayer() {
                    if (rankedInfoIndex === playerListPuuidArray.length) {
                      rankedInfo.sort((a, b) => {
                        if (tiers.indexOf(a.tier) !== tiers.indexOf(b.tier)) {
                          return tiers.indexOf(a.tier) - tiers.indexOf(b.tier);
                        }
                        if (ranks.indexOf(a.rank) !== ranks.indexOf(b.rank)) {
                          return ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
                        }
                        return a.leaguePoints - b.leaguePoints;
                      });
                      console.log(rankedInfo)
                      let bestPlayer=rankedInfo[rankedInfo.length-1];
                      setPlayerPath(current => [...current, `${bestPlayer.summonerName} (${bestPlayer.tier} ${bestPlayer.rank})`])
                      matchData=[]
                      rankedInfo=[]
                      playerListPuuid.clear()
                      if (bestPlayer.tier ==="CHALLENGER"){
                        console.log("HOLY FUCK IT WORKED")
                        return
                      }
                      else{
                        summonerLookup(bestPlayer.summonerName)
                      }
                      return;
                    }
                    fetch(`/rankedInfo/${playerListPuuidArray[rankedInfoIndex]}`)
                      .then(r => r.json())
                      .then(data => {
                        console.log(data)
                        const rankedSolo5x5 = data.filter(item=> item.queueType === 'RANKED_SOLO_5x5')
                        if (rankedSolo5x5.length!==0){
                        rankedInfo.push(rankedSolo5x5[0])
                        console.log(rankedInfo);
                      }
                        rankedInfoIndex++;
                        setTimeout(processPlayer, 1000); // delay for 1 second before processing the next player
                      });
                  }
                  processPlayer();
                }
                index++;
                setTimeout(processMatch, 1000); // delay for 1 second before processing the next match
              });
          }
          processMatch();
          console.log(playerPath)
        })
    }

    
    function handleSubmit(e){
      e.preventDefault()
      setPlayerPath([`${summonerName}`])
      summonerLookup(summonerName)
      setSummonerName('')
    }
  return (
    <div>
      SummID
        <form onSubmit={(e)=>handleSubmit(e)}>
          <input type='text' value={summonerName} onChange={(e) => setSummonerName(e.target.value)}></input>
          <button type='submit'>Submit</button>
      </form>
      <h1>{playerPath[0]} is {playerPath.length-1} degrees of separation from Challenger</h1>
      <span>{summonerPuuid}</span>
      <br/>
      <br/>
      <span>{playerPath.join('-->')}</span>
    </div>
  )
}

export default SummonerForm