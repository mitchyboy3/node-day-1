var JsonDB = require('node-json-db');
var db = new JsonDB("myDataBase", true, false);
module.exports = {
  getMovies:function(qry){
    var movies = db.getData('/movies');
    if(!qry) {
      return movies
    }
    if (qry.sort) {
      movies.sort((a,b)=>a[qry.sort] > b[qry.sort])
    }
    delete qry.sort;
    if (qry.desc){
      movies.reverse();
    }
    delete qry.desc
    if (qry.name){
      movies = movies.filter(e=>e.name.toLowerCase().indexOf(qry.name.toLowerCase())>-1)
    }
    delete qry.name
    for (key in qry){
      movies = movies.filter(e=>(e[key]+'').toLowerCase().indexOf((qry[key]+'').toLowerCase())>-1)
    }
    return movies;
  },
  addMovie:function(body){
    delete body.votes;
    body.votes =0;
    body.id = (db.getData('/movies[-1]').id || 0) +1;
    db.push('/movies[]',body)
  },
  upvoteMovie:function(id){
    var movies = db.getData('/movies')
    var movie = movies.filter(e=>e.id == id)[0];
    movie.votes++;
    db.push('/movies', movies);
  },
  getMovie:function(id){
    return db.getData('/movies').filter(e=>e.id == id)[0];
  },
  updateMovie:function(id, newMovie){
    delete newMovie.votes;
    var movies = db.getData('/movies')
    var movie = movies.filter(e=>e.id == id)[0];
    var votes = movie.votes;
    Object.assign(movie, newMovie)
    movie.votes = votes;
    db.push('/movies', movies);
  }
}

try {
  db.getData('/movies');
}catch(err){
  db.push('/movies' ,[
    {
      id:1,
      name:"What's up Doc?",
      year:1972,
      genre:'comedy, romance',
      cast:[{name:'Barbra Streisand', character:"Judy Maxwell"},
            {name:'Ryan O\'Neal', character:'Howard Bannister'},
            {name:'Madeline Kahn', character:'Eunice Burns'}],
      quotes:["Eunice, there's a person named Eunice?",
      `Propriety? Noun. Conformity to established standards of behavior or manners, suitability, rightness, or justice. See "etiquette."`,
      "Well, there's not much to see actually, we're inside a Chinese dragon."],
      votes:0
    },{votes:0,id:2,name:"Star Wars: The Force Awakens",
        year:2015,"rated":"PG-13","released":"18 Dec 2015","runtime":"135 min",
        "genre":"Action, Adventure, Fantasy","director":"J.J. Abrams",
        "writer":"Lawrence Kasdan, J.J. Abrams, Michael Arndt",
        "actors":"Harrison Ford, Mark Hamill, Carrie Fisher, Adam Driver",
        "plot":`Three decades after the defeat of the Galactic Empire, a new threat arises.
        The First Order attempts to rule the galaxy and only a rag-tag group of heroes can stop them,
        along with the help of the Resistance.`,
        "language":"English","country":"USA","awards":"N/A","poster":""},
        {
          id:3,
          genre:'horror',
          name:'The Creeping Terror', year:1964,
          plot:'A newlywed sheriff tries to stop a shambling monster that has emerged from a spaceship to eat the citizens of an American town.',
          cast:[{name:'Vic Savage', character:'Martin Gordon'}],
          votes:0
        }

  ]);
}
