import React, { useEffect, useState } from "react";

const Rank = ({ name, entries }) => {
  const [emoji, setEmoji] = useState();
  useEffect(() => {
    generateEmoji(entries);
  }, [entries]);

  const generateEmoji = (entries) => {
    fetch(
      `https://57ewjskgl7.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setEmoji(data.rankEmoji);
      })
      .catch(console.log);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginLeft: "10px",
        height: "100%",
      }}
    >
      <div className="white f5">Hey {name}</div>
      <div className="white f5">Entry count: {entries}</div>
      <div className="white f5">Rank: {emoji}</div>
    </div>
  );
};

export default Rank;
