import React, { Component }  from 'react';
import {connect} from "react-redux";
import { Glyphicon, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { Navigate } from 'react-dom'


//support routing by creating a new component

export class Movie extends Component {

    constructor(props){
        super(props);
        this.state = {radioValue: 1, quote: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    
    handleChange(event){
        this.setState({[event.target.name]:event.target.value})
    }
    handleSubmit(event){
        const quote = this.state.quote;
        const rating = this.state.radioValue;
        var env = runtimeEnv();
        fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': localStorage['token'],
                
            },
            body:JSON.stringify({
                movieId: this.props.movieId,
                quote: quote,
                rating: rating,
            })
        })
        .then(response=>response.json())

        .then((result)=>{
            if(!result['success']){
                alert(result['msg'])
            }
        })
        
        
    };
    
    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null) {
            dispatch(fetchMovie(this.props.movieId));
        }
    }
    render() {
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            )
        }
        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
            
                <p key={i}>
                    
                    <b>{review.user}</b> {review.quote}
                    
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            )
        }

        const DetailInfo = ({currentMovie}) => {
            

            if (!currentMovie) { //if not could still be fetching the movie
                return <div>Loading...</div>;
            }
            
            return (
                <div>
                    <div>
                    <Panel>
                        <Panel.Heading>Movie Detail</Panel.Heading>
                            <Panel.Body><Image className="image" src={currentMovie.imageUrl} thumbnail /></Panel.Body>
                                <ListGroup>
                                    <ListGroupItem>{currentMovie.title}</ListGroupItem>
                                    <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                                    <ListGroupItem><h4><Glyphicon glyph={'star'}/> {currentMovie.avgRating} </h4></ListGroupItem>
                                </ListGroup>
                        <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>
                    </Panel>
                    </div>

                   

                </div>
            );
        }

        return (
            <div>
                <DetailInfo currentMovie={this.props.selectedMovie} />
                
                <div>
                    <form onSubmit={this.handleSubmit} onChange ={this.handleChange}>
                        <label>Comment</label>
                        <br></br>
                            <input type="text" name="quote"/>
                        <br></br>
                        <label>Score</label>
                            <div onChange={this.handleChange}>
                                <input type="radio" value={1} name="radioValue" checked={this.state.radioValue==1}/>1&emsp;
                                <input type="radio" value={2} name="radioValue" checked={this.state.radioValue==2}/>2&emsp; 
                                <input type="radio" value={3} name="radioValue" checked={this.state.radioValue==3}/>3&emsp; 
                                <input type="radio" value={4} name="radioValue" checked={this.state.radioValue==4}/>4&emsp; 
                                <input type="radio" value={5} name="radioValue" checked={this.state.radioValue==5}/>5&emsp;     
                            </div>
                        <br></br>
                            <input type='submit' value = 'Submit'></input>
                    </form>
                </div>
            </div>  
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));