import React from 'react';
import map from './resultMapper';
import Chart from './Chart';
const { DateTime } = require('luxon');

const Results = ({ question, votes }) => {
    const date = DateTime.local();
    let upVotes = 0, downVotes = 0;
    const data = map(votes);
    votes.reduce((prev, vote) => {
        if (!date.hasSame(DateTime.fromISO(vote.date), 'day')) return prev;
        if (vote.rating > 0) { upVotes++; } else { downVotes++ };
        return (prev + vote.rating);
    }, 0);

    return <div>
        <p className="splash-subhead">
            {question}
            <div style={{ fontSize: 'small' }}>Up {upVotes} | Down {downVotes}</div>
        </p>
        <div style={{ backgroundColor: 'white', borderRadius: 3, position: 'relative' }}><Chart data={data} /></div>
    </div>;
}

export default Results;