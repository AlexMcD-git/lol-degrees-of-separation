import React, { useState } from 'react'

function SummonerForm() {
    const [summonerName, setSummonerName] = useState('')
    const [playerPath, setPlayerPath] = useState([])

    function summonerLookup(name, region='NA') {
      fetch(`/initial-lookup/${name}`)
      .then(r=>r.json())
      .then(data=>{
        setPlayerPath([data])
        if (data.tier !=="CHALLENGER"){
          findBestPlayerInRecentGames(data.puuid)
        }
      })
    }
    function findBestPlayerInRecentGames(puuid){
      fetch(`/best-from-recent-games/${puuid}`)
      .then(r=>r.json())
      .then(data=>{
        setPlayerPath(previousState=>[...previousState, data])
        if (data.tier !== "CHALLENGER"){
          findBestPlayerInRecentGames(data.puuid)
        }
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
      {playerPath.length>1?<h1>{playerPath[0].summonerName} is {playerPath.length-1} degrees of separation from Challenger</h1>:null}
      {playerPath.map(p=>`${p.summonerName}(${p.tier} ${p.division})`).join(", ")}
      <br/>
      <br/>
    </div>
  )
}

export default SummonerForm