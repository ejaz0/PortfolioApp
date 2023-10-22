// loads several packages
const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const SQLiteStore = require('connect-sqlite3')(session);
const db = new sqlite3.Database('projects-jl3.db');
  

// creates table projects at startup
db.run("CREATE TABLE IF NOT EXISTS projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)", (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table projects created!")
  
      const projects=[
        { "id":"1", "name":"Creating monitoring programs", "type":"research", "desc": "The purpose of this project is to count people passing through a corridor and to know how many are in the room at a certain time.", "year": 2022, "dev":"Python and OpenCV (Computer vision) library", "url":"/img/counting.png" },
        { "id":"2", "name":"Autonomus Self Driving Vehicles", "type":"research", "desc": "The project makes a 3D model of the analysis of the body of a person and displays the detected health problems. It is useful for doctors to view in 3D their patients and the evolution of a disease.", "year": 2012, "url":"/img/medical.png" },
        { "id":"3", "name":"3D Physics Visualisation", "type":"teaching", "desc": "During the lockdowns in France, this project was useful to test the students online with a Quizz system.", "year": 2021, "url":"/img/qcm07.png" },
        { "id":"4", "name":"Virtual Google Earth Model", "desc": "The project is about finding and quantifying the differences between two images of the same size. The applications were numerous: satallite imaging, medical imaging,...", "year": 2020, "type":"research", "url":"/img/diaw02.png" },
        { "id":"5", "name":"UPS Shipping System", "desc": "This project was about the creation of a database to manage the students' internships.", "year": 2012, "type":"teaching", "url":"/img/management.png" }
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
        {"id":"4", "name": "Random", "type": "Framework", "desc": "Random."},
        {"id":"5", "name": "Javascript", "type": "Programming language", "desc": "Programming with Javascript on the client side."},
        {"id":"6", "name": "Node", "type": "Programming language", "desc": "Programming with Javascript on the server side."},
        {"id":"7", "name": "Express", "type": "Framework", "desc": "A framework for programming Javascript on the server side."},
        {"id":"8", "name": "C++", "type": "Programming Language", "desc": "A library for Image Processing with Python."},
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
   
});

// defines the port
const port = 8081
// creates the Express app 
const app = express();

// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');


// define static directory "public"
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
    console.log("Req. URL: ", req.url)
    next()
})

app.use(session({
  store: new SQLiteStore({ db: 'session-db.db' }),
  secret: 'thisissecret',
  saveUninitialized: false,
  resave: false,
}));
/***
ROUTES
***/
// renders a view WITHOUT DATA
app.get('/', (req, res) => {
    console.log("SESSION: ", req.session)
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('home.handlebars', model);
});

// renders a view WITHOUT DATA
app.get('/about', (req, res) => {
  console.log("SESSION: ", req.session)
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('about.handlebars', model);
});

// renders a view WITHOUT DATA
app.get('/contact', (req, res) => {
  console.log("SESSION: ", req.session)
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('contact.handlebars', model);
});


app.get('/register-get', (req, res)=>{
  console.log("SESSION: ", req.session)
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('register-get.handlebars', model);
});

app.post('/register-get', (req, res) => {
  const { uname, upassword } = req.body;  // Correct field names for destructuring

  // Hash the password
  const hash = bcrypt.hashSync(upassword, 10);

  db.run('INSERT INTO loginUser(uname, upassword) VALUES (?, ?)', [uname, hash], (err) => {
    if (err) {
      res.status(500).send({ error: 'Server Error' });
    } else {
      res.redirect('/login-get');
    }
  });
});

app.get('/login-get', (req, res) => {
  const {uname, upassword} = req.body;

  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  res.render('login-get.handlebars', model);
});

app.post('/login-get', (req, res) => {
  const un = req.body.un;
  const pw = req.body.pw;

  db.get("SELECT * FROM loginUser WHERE uname = ?", [un], (error, row) => {
    if (error) {
      console.error("Error querying the database:", error);
      req.session.isAdmin = false;
      req.session.isLoggedIn = false;
      req.session.name = "";
      res.redirect('/login-get');
    } else if (row) {
      // Compare the provided password with the hashed password in the database
      bcrypt.compare(pw, row.upassword, (compareErr, result) => {
        if (compareErr) {
          console.error("Error comparing passwords:", compareErr);
          req.session.isAdmin = false;
          req.session.isLoggedIn = false;
          req.session.name = "";
          res.redirect('/login-get');
        } else {
          if (result) {
            console.log(`${un} is logged in`);
            req.session.isLoggedIn = true;
            req.session.name = un;

            // Check if this user is the specific admin
            if (un === "saki") {
              req.session.isAdmin = true;
            } else {
              req.session.isAdmin = false;
            }

            res.redirect('/');
          } else {
            // Passwords don't match
            req.session.isAdmin = false;
            req.session.isLoggedIn = false;
            req.session.name = "";
            res.redirect('/login-get');
          }
        }
      });
    } else {
      req.session.isAdmin = false;
      req.session.isLoggedIn = false;
      req.session.name = "";
      res.redirect('/login-get');
    }
  });
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
    db.all("SELECT * FROM projects", function (error, theProject) {
        if (error) {
            const model = {
                dbError: true,
                theError: error,
                projects: [],
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin

            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
        else {
            const model = {
                dbError: false,
                theError: "",
                projects: theProject,
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin
            }
            // renders the page with the model
            res.render("projects.handlebars", model)
        }
      })
});

app.get('/skills', (req, res) => {
  db.all("SELECT * FROM skills", function (error, theSkill) {
      if (error) {
          const model = {
              dbError: true,
              theError: error,
              skills: [],
              isLoggedIn: req.session.isLoggedIn,
              name: req.session.name,
              isAdmin: req.session.isAdmin
          }
          // renders the page with the model
          res.render("skills.handlebars", model)
      }
      else {
          const model = {
              dbError: false,
              theError: "",
              skills: theSkill,
              isLoggedIn: req.session.isLoggedIn,
              name: req.session.name,
              isAdmin: req.session.isAdmin
          }
          // renders the page with the model
          res.render("skills.handlebars", model)
      }
    })
});

app.get('/skills/delete/:id', (req, res)=>{
  const id = req.params.id
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("DELETE FROM skills WHERE sid=?", [id], function(error, theSkill){
      if(error){
        const model = {dbError: true, theError: error,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render('home.handlebars', model)
    } else{
      const model = {dbError: false, theError: "",
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("home.handlebars", model)
    }
  })
}else{
  res.redirect('/login-get')
}
})

app.get('/skills/new', (req, res)=> {
  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('newskill.handlebars', model)
  } else{
    res.redirect('/login')
  }
})

app.post('/skills/new', (req,res) => {
  const newp = [
    req.body.sname, req.body.sdesc, req.body.stype,
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin == true){
    db.run("INSERT INTO skills (sname, sdesc, stype) VALUES (?, ?, ?)", newp, (error) => {
      if(error){
        console.log("ERROR: ", error)
      } else{
        console.log("Line added into the skills table!")
      }
      res.redirect('/skills')
    })
  } else{
    res.redirect('/login')
  }
})

app.get('/skills/update/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM skills WHERE sid=?", [id], function (error, theSkill){
    if(error){
      console.log("ERROR: ", error)
      const model = {
        dbError: true, theError: error,
        skills: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render('modifyskills.handlebars', model)
    }
    else{
      const model = {
        dbError: false, theError: "",
        skills: theSkill,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeR(value){return value == "TechnicalSkill";},
          theTypeT(value){return value == "SoftSkill";},
          theTypeO(value){return value == "OtherSkill";}
        }
      }
      res.render("modifyskills.handlebars", model)
    }
  })
});

app.post('/skills/update/:id', (req, res)=>{
  const id = req.params.id
  const newp = [
    req.body.sname, 
    req.body.sdesc, 
    req.body.stype,
    id
  ]
  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    db.run("UPDATE skills SET sname=?, sdesc=?, stype=? WHERE sid=?", newp, (error) => {
      if(error){
        console.log("ERROR: ", error)
      } else {
        console.log("Skills updated!")
      }
      res.redirect('/skills')
    })
  } else{
    res.redirect('/login')
  }
})

// sends back a SVG image if asked for "/favicon.ico"
app.get('/favicon.ico', (req, res) => {
    res.setHeader("Content-Type", "image/svg+xml")
    res.sendFile(__dirname + "/img/jl.svg")
});

app.get('/projects/delete/:id', (req, res)=>{
  const id = req.params.id
  if(req.session.isLoggedIn==true && req.session.isAdmin==true){
    db.run("DELETE FROM projects WHERE pid=?", [id], function(error, theProject){
      if(error){
        const model = {dbError: true, theError: error,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render('home.handlebars', model)
    } else{
      const model = {dbError: false, theError: "",
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("home.handlebars", model)
    }
  })
}else{
  res.redirect('/login-get')
}
})


app.get('/projects/new', (req, res)=> {
  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('newproject.handlebars', model)
  } else{
    res.redirect('/login')
  }
})

app.post('/projects/new', (req,res) => {
  const newp = [
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg,
  ]
  if(req.session.isLoggedIn==true && req.session.isAdmin == true){
    db.run("INSERT INTO projects (pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?)", newp, (error) => {
      if(error){
        console.log("ERROR: ", error)
      } else{
        console.log("Line added into the projects table!")
      }
      res.redirect('/projects')
    })
  } else{
    res.redirect('/login')
  }
})

app.get('/projects/update/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM projects WHERE pid=?", [id], function (error, theProject){
    if(error){
      console.log("ERROR: ", error)
      const model = {
        dbError: true, theError: error,
        project: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render('modifyproject.handlebars', model)
    }
    else{
      const model = {
        dbError: false, theError: "",
        project: theProject,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeR(value){return value == "Research";},
          theTypeT(value){return value == "Teaching";},
          theTypeO(value){return value == "Other";}
        }
      }
      res.render("modifyproject.handlebars", model)
    }
  })
});

app.post('/projects/update/:id', (req, res)=>{
  const id = req.params.id
  const newp = [
    req.body.projname, 
    req.body.projyear, 
    req.body.projdesc,
    req.body.projtype, 
    req.body.projimg, 
    id
  ]
  if(req.session.isLoggedIn == true && req.session.isAdmin == true){
    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=?, ptype=?, pimgURL=? WHERE pid=?", newp, (error) => {
      if(error){
        console.log("ERROR: ", error)
      } else {
        console.log("Project updated!")
      }
      res.redirect('/projects')
    })
  } 
})

app.get('/projects/about/:id', (req, res) => {
  const projectId = req.params.id;

  db.get("SELECT * FROM projects WHERE pid = ?", projectId, function (error, project) {
    if (error) {
        const model = {
            dbError: true,
            theError: error,
            project: null,  // Adjust property name to match the template
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin
        }
        res.render("error.handlebars", model);
    } else {
        const model = {
            dbError: false,
            theError: "",
            project: project,  // Adjust property name to match the template
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin
        }
        res.render("projectabout.handlebars", model);
    }
  });
});

app.get('/skills/about/:id', (req, res) => {
  const skillId = req.params.id;

  db.get("SELECT * FROM skills WHERE sid = ?", skillId, function (error, skill) {
    if (error) {
        const model = {
            dbError: true,
            theError: error,
            skill: null,  // Adjust property name to match the template
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin
        }
        res.render("error.handlebars", model);
    } else {
        const model = {
            dbError: false,
            theError: "",
            skill: skill,  // Adjust property name to match the template
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin
        }
        res.render("skillabout.handlebars", model);
    }
  });
});


// run the server and make it listen to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
});
