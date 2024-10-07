import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const riddleAPI_URL = 'https://riddles-api.vercel.app/random';
const unspashAPI_URL = 'https://api.unsplash.com/photos/random?client_id='
const unsplashAuthKey = 'zknmyVuJ-YtPm-x1JCTcfwmJFjq52gYMvM_RybzBOcE'

var riddleOn = false;
var riddle;
var picture;

app.use(express.static("public"));

app.listen(port, () =>{
    console.log(`App is running on port ${port}`);
});

app.get('/', async (req, res) => {
    try{
        const response = await axios.get(riddleAPI_URL);
        riddle = response.data;
        console.log(riddle);
        riddleOn = true;
        console.log(riddleOn);
        var result;
        try{
            const response = await axios.get(unspashAPI_URL + unsplashAuthKey + '&query=' + 'question-mark');
            result = response.data;
        }
        catch (error){
            res.render("index.ejs", {riddle : error.message})
            console.log(error.message);
        }
        res.render("index.ejs", {content : riddle,
             hint : result.urls.raw,
              url: result.urls.raw,
            author: result.user.username});
    }
    catch (error){
        res.render("index.ejs", {riddle : error.message})
        console.log(error.message);
    }
});

app.get("/get-picture", async (req, res) => {
    if (riddleOn){
        try{
            const response = await axios.get(unspashAPI_URL + unsplashAuthKey + '&query=' + riddle.answer);
            const result = response.data;
            picture = result;
            res.render("index.ejs", {content : riddle,
                 hint : result.urls.raw,
                url: result.urls.raw,
                author: result.user.username})
        }
        catch (error){
            console.log("Unsplash error: " + error.message);
        }
    }
    
});

app.get("/get-answer", (req, res) => {
    res.render("index.ejs", {content : riddle,
        hint : picture.urls.raw,
       url: picture.urls.raw,
       author: picture.user.username,
        answer : riddle.answer
    }
    )
})