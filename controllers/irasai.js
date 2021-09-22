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

router.get('/pridejimas', (req, res) => {
    res.render('add');
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
    //res.send('edit');
});

router.post('/edit_submit', (req, res) => {

    IrasaiModel.findByIdAndUpdate(req.body.id, {
        pavadinimas: req.body.pavadinimas,
        turinys: req.body.turinys,
        data: req.body.data
    });

    res.redirect('/irasai');
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

// router.get('/paieska/:s', (req, res) => {
//     const s = req.params.s;

//     IrasaiModel.find( (error, informacija) => {
//         if (!error) {
//             res.send('Klaidu nera');
//         } else {
//             res.send('Ivyko klaida');
//         }
//     });
// });

module.exports = router;