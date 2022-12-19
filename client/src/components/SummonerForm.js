import React, { useState } from 'react'

function SummonerForm() {
    const [summonerName, setSummonerName] = useState('')
    const [summonerPuuid, setSummonerPuuid] = useState('')
    const [playerPath, setPlayerPath] = useState([])
    const test = []
    const playerListPuuid = new Set()
    const rankedInfo = []

    function summonerLookup(name) {
      fetch(`/puuid/${name}`)
      .then(r=>r.json())
      .then(data=>{
        setSummonerPuuid(data.puuid)
        findChallenger(data.puuid)
      }
      )
    }
    function findChallenger(puuid){
      fetch(`/matches/${puuid}`)
        .then(r=>r.json())
        .then(matches=>{matches.forEach(match=>{
          fetch(`/match/${match}`)
          .then(r=>r.json())
          .then(data=>{
            test.push(data)
            console.log(test)
            if (test.length === 10){
              //thing to do after all 10 match lookups are done
              test.forEach(match =>{
                match.metadata.participants.forEach(participant => playerListPuuid.add(participant))
              })
              console.log (playerListPuuid)
              let playerListPuuidArray = [...playerListPuuid]
              //test for just 1 player
              // fetch(`/rankedInfo/${playerListPuuidArray[0]}`)
              //   .then(r=>r.json())
              //   .then(data=>{
              //     rankedInfo.push(data)
              //     console.log(rankedInfo)
              //   })

              playerListPuuidArray.forEach(puuid=>{
                fetch(`/rankedInfo/${puuid}`)
                .then(r=>r.json())
                .then(data=>{
                  data[0].queueType==="RANKED_SOLO_5x5"?rankedInfo.push(data[0]):rankedInfo.push(data[1])
                  console.log(rankedInfo)
                })
              })
            }
          })
        })
      });
    }

    
    function handleSubmit(e){
      e.preventDefault()
      summonerLookup(summonerName)
    }
  return (
    <div>
      SummID
        <form onSubmit={(e)=>handleSubmit(e)}>
          <input type='text' value={summonerName} onChange={(e) => setSummonerName(e.target.value)}></input>
          <button type='submit'>Submit</button>
      </form>
      <span>{summonerPuuid}</span>
    </div>
  )
}

export default SummonerForm