const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./services/movieDb')

app.use(bodyParser.json());

app.get('/api/movies',(req, res)=>{
    res.status(200).send(db.getMovies(req.query))
})

app.post('/api/movies', (req, res)=>{
    req.body // new movie
    if(req.body.name){
        db.addMovie(req.body);
        const movies = db.getMovies();
        res.send('Thanks for adding your movie' + movies[movies.length - 1])
    }
    else{
        res.status(400).send('Must supply name');
    }
})

app.put('/api/movies/vote/:id', (req, res)=>{
    req.params.id // movie we are voting for
    db.upvoteMovie(req.params.id);
    var movie = db.getMovie(req.params.id)
    res.send(`Your vote for ${movie.name} has been cast. It has ${movie.votes} votes.`)
})

app.put('/api/movies/:id', (req, res)=>{
    db.updateMovie(req.params.id, req.body);
    res.send(db.getMovie(req.params.id))
})

app.listen(3000, ()=> {console.log('Listening on port 3000 & I\'m a bad mammajamma.')})




//********************MESSAGES PRACTICE*********************************** */

// var messages = []

// app.get('/api/message',(request, response)=>{
//     console.log('This is a hit! Shots fired! Shots fired!');
//     response.send(messages)
// })

// app.post('/api/message', (request, response)=>{
//     messages.push(request.body.message);
//     response.send('Your message has been delivered -- Su mensaje se ha sido enviadoclear')

// })

// app.get('/api/movies', (req, res)=>{

// })