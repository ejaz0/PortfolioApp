// loads several packages
const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const db = new sqlite3.Database('projects-jl3.db')

// creates table projects at startup
db.run("CREATE TABLE IF NOT EXISTS projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)", (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table projects created!")
  
      const projects=[
        { "id":"1", "name":"Counting people with a camera", "type":"research", "desc": "The purpose of this project is to count people passing through a corridor and to know how many are in the room at a certain time.", "year": 2022, "dev":"Python and OpenCV (Computer vision) library", "url":"/img/counting.png" },
        { "id":"2", "name":"Visualisation of 3D medical images", "type":"research", "desc": "The project makes a 3D model of the analysis of the body of a person and displays the detected health problems. It is useful for doctors to view in 3D their patients and the evolution of a disease.", "year": 2012, "url":"/img/medical.png" },
        { "id":"3", "name":"Multiple questions system", "type":"teaching", "desc": "During the lockdowns in France, this project was useful to test the students online with a Quizz system.", "year": 2021, "url":"/img/qcm07.png" },
        { "id":"4", "name":"Image comparison with the Local Dissmilarity Map", "desc": "The project is about finding and quantifying the differences between two images of the same size. The applications were numerous: satallite imaging, medical imaging,...", "year": 2020, "type":"research", "url":"/img/diaw02.png" },
        { "id":"5", "name":"Management system for students' internships", "desc": "This project was about the creation of a database to manage the students' internships.", "year": 2012, "type":"teaching", "url":"/img/management.png" }
      ]
      // inserts projects
      projects.forEach( (oneProject) => {
        db.run("INSERT OR IGNORE INTO projects (pid, pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?, ?)", [oneProject.id, oneProject.name, oneProject.year, oneProject.desc, oneProject.type, oneProject.url], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the projects table!")
          }
        })
      })
    }
  })
  
  // creates skills projects at startup
  db.run("CREATE TABLE IF NOT EXISTS skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL)", (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table skills created!")
  
      const skills=[
        {"id":"1", "name": "PHP", "type": "Programming language", "desc": "Programming with PHP on the server side."},
        {"id":"2", "name": "Python", "type": "Programming language", "desc": "Programming with Python."},
        {"id":"3", "name": "Java", "type": "Programming language", "desc": "Programming with Java."},
        {"id":"4", "name": "ImageJ", "type": "Framework", "desc": "Java Framework for Image Processing."},
        {"id":"5", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript on the client side."},
        {"id":"6", "name": "Node", "type": "Programming language", "desc": "Programming with Javascript on the server side."},
        {"id":"7", "name": "Express", "type": "Framework", "desc": "A framework for programming Javascript on the server side."},
        {"id":"8", "name": "Scikit-image", "type": "Library", "desc": "A library for Image Processing with Python."},
        {"id":"9", "name": "OpenCV", "type": "Library", "desc": "A library for Image Processing with Python."},
      ]
  
      // inserts skills
      skills.forEach( (oneSkill) => {
        db.run("INSERT OR IGNORE INTO skills (sid, sname, sdesc, stype) VALUES (?, ?, ?, ?)", [oneSkill.id, oneSkill.name, oneSkill.desc, oneSkill.type], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the skills table!")
          }
        })
      })
    }
  })
  
  // creates table projectsSkills at startup
  db.run("CREATE TABLE IF NOT EXISTS projectsSkills (psid INTEGER PRIMARY KEY, pid INTEGER, sid INTEGER, FOREIGN KEY (pid) REFERENCES projects (pid), FOREIGN KEY (sid) REFERENCES skills (sid))", (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table projectsSkills created!")
  
      const projectsSkills=[
        {"id":"1", "pid":"1", "sid": "2"},
        {"id":"2", "pid":"1", "sid": "8"},
        {"id":"3", "pid":"1", "sid": "9"},
        {"id":"4", "pid":"2", "sid": "3"},
        {"id":"5", "pid":"2", "sid": "4"},
        {"id":"6", "pid":"3", "sid": "1"},
        {"id":"7", "pid":"4", "sid": "2"},
        {"id":"8", "pid":"4", "sid": "8"},
        {"id":"9", "pid":"4", "sid": "9"},
        {"id":"10", "pid":"5", "sid": "1"}
      ]
      // inserts projectsSkills
      projectsSkills.forEach( (oneProjectSkill) => {
        db.run("INSERT OR IGNORE INTO projectsSkills (psid, pid, sid) VALUES (?, ?, ?)", [oneProjectSkill.id, oneProjectSkill.pid, oneProjectSkill.sid], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the projectsSkills table!")
          }
        })
      })
    }
  })
  
  db.run("CREATE TABLE IF NOT EXISTS loginUser (lid INTEGER PRIMARY KEY, uname TEXT NOT NULL, upassword TEXT NOT NULL)", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Table loginUser created successfully.');

    // Insert a username and password
    db.run("INSERT INTO loginUser (uname, upassword) VALUES ('user1', 'password')", (insertErr) => {
        if (insertErr) {
            return console.error(insertErr.message);
        }
        console.log('Username and password inserted successfully.');
    });
});

// defines the port
const port = 8081
// creates the Express app 
const app = express();
app.use(cookieParser());
app.use(session({
  secret: 'key', // Change this to your own secret key
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');


// define static directory "public"
app.use(express.static('public'))

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
    console.log("Req. URL: ", req.url)
    next()
})

app.use((req, res, next) => {
  res.locals.session = {
    loggedIn: req.session.loggedIn,
    username: req.session.username
  };
  next();
});

/***
ROUTES
***/
// renders a view WITHOUT DATA
app.get('/', (req, res) => {
    res.render('home');
});

// renders a view WITHOUT DATA
app.get('/about', (req, res) => {
    res.render('about');
});

// renders a view WITHOUT DATA
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/login-get', (req, res) => {
  const sessionInfo = {
    loggedIn: req.session.loggedIn,
    username: req.session.username
  };
  res.render('login-get', { session: sessionInfo });
});

app.post('/login-get', (req, res) => {
  const { uname, upassword } = req.body;

  // You would typically validate the username and password here
  // For simplicity, let's assume validation is successful
  // Store user information in session
  req.session.username = uname;
  req.session.loggedIn = true;

  // Redirect to a dashboard or any other page after successful login
  res.redirect('/');
});

app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Redirect to the login page after logging out
    res.redirect('/login-get');
  });
});

// renders a view WITH DATA!!!
app.get('/projects', (req, res) => {
    db.all("SELECT * FROM projects", function (error, theProjects) {
        if (error) {
            const model = {
                dbError: true,
                theError: error,
                projects: []
            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
        else {
            const model = {
                dbError: false,
                theError: "",
                projects: theProjects
            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
      })
});

app.get('/skills', (req, res) => {
  db.all("SELECT * FROM skills", function (error, theSkills) {
      if (error) {
          const model = {
              dbError: true,
              theError: error,
              skills: []
          }
          // renders the page with the model
          res.render("skills.handlebars", model)
      }
      else {
          const model = {
              dbError: false,
              theError: "",
              skills: theSkills
          }
          // renders the page with the model
          res.render("skills.handlebars", model)
      }
    })
});

// sends back a SVG image if asked for "/favicon.ico"
app.get('/favicon.ico', (req, res) => {
    res.setHeader("Content-Type", "image/svg+xml")
    res.sendFile(__dirname + "/img/jl.svg")
});

// run the server and make it listen to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
});
