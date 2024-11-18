const express = require('express');
import 'dotenv/config'
import app from "./app";
app.on('error',(err)=>{
    console.log(err);
    
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
