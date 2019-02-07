import React, { Component } from 'react';
import View from './View';
import Results from './Results';
import {voteFor, getSurvey, getVotes, getQuestionOfTheDay} from './questionService';
import {hash} from './hash';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : hash.survey || "example",
            startDate: "",
            questions: [],
            question : "",
            hasVoted: hash.voted || false,
            votes : []
        }
    }

    componentDidMount() {
        getSurvey(this.state.name)
            .then(response => {
                this.setState({ ...response.survey })
            })
        getQuestionOfTheDay(this.state.name)
            .then(response => {
                this.setState({ question : response.question });
            })
        if (this.state.hasVoted) {
            getVotes(this.state.name)
                .then(({ votes }) => {
                    this.setState({votes});
                });
        }
    }

    onVote(rating) {
        voteFor({ name: this.state.name, date : new Date(), rating })
            .then((result) => 
                this.setState({ 
                    hasVoted : true, 
                    votes: result.votes 
                })
            ).catch(err => {
                console.log(err);
            });
    }

    render() {
        const inner = this.state.questions.length < 1
        ?  <h1 className="splash-head">loading...</h1> : !this.state.hasVoted 
            ? <View {...this.state} onVote={(rating) => this.onVote(rating)} />
            : <Results {...this.state} />
        return (<div className="splash-container">
            <div className="splash">
                {inner}
            </div>
        </div>);
    }
}