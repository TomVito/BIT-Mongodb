const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const IrasaiModel = mongoose.model('irasai');

router.get('/', (req, res) => {

    IrasaiModel.find( (error, informacija) => {
        if (!error) {

            informacija.forEach(function(item) {
                var data = new Date(item.data);
                item.data = data.toLocaleDateString('lt-LT');
                item._id = item._id.toString();
            });
            res.render('list', {data: informacija});
        } else {
            res.send('Ivyko klaida');
        }
    }).sort({pavadinimas : 1}).lean();
    // }).collation({locale: "lt"}).sort({pavadinimas : 1}).lean();
});

router.get('/rusiavimas/desc', (req, res) => {

    IrasaiModel.find( (error, informacija) => {
        if (!error) {

            informacija.forEach(function(item) {
                var data = new Date(item.data);
                item.data = data.toLocaleDateString('lt-LT');
                item._id = item._id.toString();
            });
            res.render('list', {data: informacija});
        } else {
            res.send('Ivyko klaida');
        }
    }).sort({pavadinimas : -1}).lean();
    // }).collation({locale: "lt"}).sort({pavadinimas : 1}).lean();
});

router.get('/pridejimas', (req, res) => {
    var data = new Date();
    data = data.toLocaleDateString('lt-LT');
    res.render('add', {data: data});
});

router.post('/edit_submit', (req, res) => {

    IrasaiModel.findByIdAndUpdate(req.body.id, {
        pavadinimas: req.body.pavadinimas,
        turinys: req.body.turinys,
        data: req.body.data
    }).then(data => {
        res.redirect('/irasai');
    });
});

router.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    IrasaiModel.findById(id).lean()
    .then(info => {

        var data = new Date(info.data);
        info.data = data.toLocaleDateString('lt-LT');

        res.render('edit', { edit : info});
    }).catch(err => {
        res.json({
            response: 'fail',
            message: err.message
        });
    });
});

router.get('/view/:id', (req, res) => {
    const id = req.params.id;

    IrasaiModel.findById(id).lean()
    .then(info => {

        var data = new Date(info.data);
        info.data = data.toLocaleDateString('lt-LT');

        res.render('view', { data : info});
    }).catch(err => {
        res.json({
            response: 'fail',
            message: err.message
        });
    });
});

router.post('/submit', (req, res) => {

    var irasas = new IrasaiModel();
    irasas.pavadinimas = req.body.pavadinimas;
    irasas.turinys = req.body.turinys;
    irasas.data = req.body.data;
    irasas.save();

    console.log(req.body);
    res.redirect('/irasai');
});

router.get('/paieska', (req, res) => {

    res.render('paieska');

});

router.post('/paieska', (req, res) => {
    const s = req.body.paieska;

    IrasaiModel.find( {$text: {$search: s}}, (error, informacija) => {
        if (!error) {

            informacija.forEach(function(item) {
                var data = new Date(item.data);
                item.data = data.toLocaleDateString('lt-LT');
                item._id = item._id.toString();
            });
            res.render('paieska', {data: informacija});
        } else {
            res.send('Ivyko klaida');
        }
    }).collation({locale: "lt"}).sort({pavadinimas : 1}).lean();
});

module.exports = router;