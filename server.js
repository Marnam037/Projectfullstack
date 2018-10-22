var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://zwkczabvzjehkh:9d7bacef083b60f955f8c2b407ca84846542de68c94aab2dce86907e9c7fea27@ec2-107-20-249-48.compute-1.amazonaws.com:5432/d9knlg2mile5gl?ssl=true');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    var name = 'Poramat Nukliang';
    var hobbies = ['Music', 'Movie', 'Programming'];
    var bdate = '09/10/2018';
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});
//Show all products
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from products';
    if (id) {
        sql += ' where id =' + id + ' order by id ASC';
    }
    db.any(sql + ' order by id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data })
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//Product_edit
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id =" + pid;
    db.any(sql, )
        .then(function (data) {
            res.render('pages/product_edit', { product: data[0] });
        })
        .catch(function (error) {

            console.log('ERROR' + error);
        })
});
//Update Products data
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}',price = '${price}' where id = ${id}`;
    // db.none
    db.none(sql);
    console.log('UPDATE:' + sql);
    res.redirect('/products');

});
//Add New Product
app.post('/products/insert_product', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id,title,price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//Time product
app.get('/insert_product', function (req, res) {
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    res.render('pages/insert_product', { time: time });
});
//Delete products
app.get('/product_delete/:pid', function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
//report product
app.get('/report_product', function(req, res) {
    var sql ='SELECT products.id,products.title,products.price,products.tags,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price FROM products,purchase_items where products.id=purchase_items.product_id group by products.id order by products.id ASC;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
        // console.log('DATA' + data);
        res.render('pages/report_product', { product: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })
});

    
//Show all users
app.get('/users', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from users';
    if (id) {
        sql += ' where id =' + id + ' order by id ASC';
    }
    db.any(sql + ' order by id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//Delete users
app.get('/user_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
//User_edit
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = "select * from users where id =" + id;
    db.any(sql, )
        .then(function (data) {
            res.render('pages/user_edit', { user: data[0] });
        })
        .catch(function (error) {

            console.log('ERROR' + error);
        })
});

//Update Users data
app.post('/user/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email = '${email}',password = '${password}' where id = ${id}`;
    // db.none
    db.none(sql);
    console.log('UPDATE:' + sql);
    res.redirect('/users');

});
//Add New user
app.post('/users/insert_user', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `INSERT INTO users (id,email,password)  VALUES ('${id}', '${email}', '${password}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//Time user
app.get('/insert_user', function (req, res) {
    var time = moment().format();
    res.render('pages/insert_user', { time: time });
});

//report user
app.get('/report_user', function(req, res) {
    var sql='select purchases.user_id,purchases.name,users.email,sum(purchase_items.price) as price from purchases,users,purchase_items where purchases.user_id=users.id and purchases.id=purchase_items.purchase_id group by purchases.user_id,purchases.name,users.email order by sum(purchase_items.price) desc LIMIT 30'
    db.any(sql)
        .then(function (data) 
        {
            // console.log('DATA' + data);
            res.render('pages/report_user', { user : data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port)
});