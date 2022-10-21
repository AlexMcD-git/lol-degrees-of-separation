import React, { useState } from 'react'

function SummonerForm() {
    const [summonerName, setSummonerName] = useState('')
    const API_KEY = ``
    const [summonerPuuid, setSummonerPuuid] = useState('')

    function summonerLookup(name) {
      fetch(`/puuid/${name}`)
      .then(r=>r.json())
      .then(data=>setSummonerPuuid(data.puuid))
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