import React from 'react';

const View = ({ question, sub, onVote }) => {
    return <div>
        <h1 className="splash-head">{question}</h1>
        <p className="splash-subhead">
            {sub ? sub : ""}
        </p>
        <p>
            <button onClick={() => onVote(1)}
                className="pure-button pure-button-primary">
                Yes</button>
            <button onClick={() => onVote(-1)}
                className="pure-button pure-button-primary">
                No</button>
        </p>
    </div>
};
export default View;