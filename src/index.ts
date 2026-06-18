import express from 'express';
const app=express();
app.get('/health',(_,res)=>res.json({status:'ok'}));
app.listen(process.env.PORT||5000);
