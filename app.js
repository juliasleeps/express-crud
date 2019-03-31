var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var path = require('path')
var courses = require('./data/courses.json');
var contacts = require('./data/contacts.json')
var bodyParser = require('body-parser');
var sendEmail = require('./send-email');

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

app.get('/', function(req, res){
    res.render('index', {
        title:'crud',
        name: 'index'
    })
});

app.get('/courses', function(req, res){
    res.render('courses', {
        title: 'courses',
        courses: courses,
        name: 'courses'
    });
});

app.get('/courses/add', function(req, res){
    res.render('add');
});

app.post('/courses/add', function(req, res){
    var course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.redirect('/courses');
});

app.get('/courses/edit/:id', function(req, res){
    var course = courses.find(function(course){
        return course.id === parseInt(req.params.id);
    });

    if(!course){
        res.sendStatus(404);
        return;
    }

    res.render('edit', {course: course});
});

app.post('/courses/edit/:id', function(req, res){
    var course = courses.find(function(course){
        return course.id === parseInt(req.params.id);
    });

    if(!course){
        res.sendStatus(404);
        return;
    }

    course.name = req.body.name;

    res.redirect('/courses');
});

app.get('/courses/delete/:id', function(req, res){
    courses = courses.filter(function(course){
        return course.id !== parseInt(req.params.id);
    })

    res.redirect('/courses')
});

app.get('/about', function(req, res){
    res.render('about', {
        title:'about',
        name: 'about'
    })
});

app.get('/contacts', function(req, res){
    res.render('contacts', {
        title:'contacts',
        name: 'contacts',
        status: ''
    });
});

app.post('/contacts', function(req, res){
    var contact = {
        id: contacts.length + 1,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    }
    if(!contact.name || !contact.phone || !contact.email){
        res.render('contacts', {
            title:'contacts',
            name: 'contacts',
            status: 'error'
        });
        return
    }
    contacts.push(contact);
    console.log(contacts);
    sendEmail(contact.email);
    res.render('contacts', {
        title:'contacts',
        name: 'contacts',
        status: 'ok'
    });
});

app.listen(3000, function () {
    console.log('Server on http://localhost:3000')
});