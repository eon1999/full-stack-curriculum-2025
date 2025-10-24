import React, { useState } from 'react'

export default function Scoreboard(props) {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);

    // setTeam1Score (team1Score + 1)
  return (
    <div>
        {props.team1} vs {props.team2}
        <div>
            <h2>Scoreboard</h2>
            <p>{props.team1}: {team1Score}</p>
            <p>{props.team2}: {team2Score}</p>
            <button onClick={() => setTeam1Score(team1Score + 1)}>Increase {props.team1} Score</button>
            <button onClick={() => setTeam2Score(team2Score + 1)}>Increase {props.team2} Score</button>
        </div>
    </div>
  );
}
