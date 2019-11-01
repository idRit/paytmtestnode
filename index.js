const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");

const {initPayment, responsePayment} = require("./paytm/service");

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/paywithpaytm/:amount', async (req, res) => {
    let amount = req.params.amount;
    try {
        let response = await initPayment(amount);
        console.log(response);
        res.render("paytmRedirect.ejs", {
            resultData: response,
            paytmFinalUrl: process.env.PAYTM_FINAL_URL
        });
    } catch(err) {
        console.log(err);
        res.json({
            success: false,
            message: err
        });
    }
});

app.post('/paywithpaytm/:amount');

app.post("/paywithpaytmresponse", (req, res) => {
    responsePayment(req.body).then(
        success => {
            res.render("response.ejs", {resultData: "true", responseData: success});
        },
        error => {
            res.send(error);
        }
    );
});

app.listen(process.env.PORT || 3000);
console.log('running');