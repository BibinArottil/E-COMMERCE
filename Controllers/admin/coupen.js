const Coupen=require('../../Model/admin/coupenModel')

const viewCoupen=async(req,res)=>{
    try {
        const coupen=await Coupen.find()
        res.render('../Views/admin/coupen.ejs',{coupen})
    } catch (error) {
        console.log(error);
        res.redirect('/errorAdmin')
    }
}

const addCoupen=async(req,res)=>{
    try {
        const code=req.body.code.toUpperCase()
        const newCoupen=new Coupen({
            code:code,
            discount:req.body.discount,
            minpurchaseamount:req.body.minamount,
            createdate:req.body.createdate,
            expiredate:req.body.expiredate
        })
        await newCoupen.save()
        res.redirect('/coupen')
    } catch (error) {
        console.log(error);
        res.redirect('/errorAdmin')
    }
}

const blockUnblock=async(req,res)=>{
    try {
        const coupen=await Coupen.findById(req.query.id)
        if(coupen.status==true){
            await Coupen.findByIdAndUpdate(req.query.id,{$set:{status:false}})
        }else{
            await Coupen.findByIdAndUpdate(req.query.id,{$set:{status:true}})
        }
        res.redirect('/coupen')
    } catch (error) {
        console.log(error);
        res.redirect('/errorAdmin')
    }
}

const editCoupen=async(req,res)=>{
    try {
        const coupen=await Coupen.findById(req.query.id)
        res.render('../Views/admin/editcoupen.ejs',{coupen})
    } catch (error) {
        console.log(error);
        res.redirect('/admin-error')
    }
}

const updateCoupen=async(req,res)=>{
    try {
        const code=req.body.code.toUpperCase()
        await Coupen.findByIdAndUpdate(req.body.id,{$set:{
            code:code,
            discount:req.body.discount,
            minpurchaseamount:req.body.minamount,
            createdate:req.body.createdate,
            expiredate:req.body.expiredate
        }
    })
       res.redirect('/coupen')
    } catch (error) {
        console.log(error);
        res.redirect('/errorAdmin')
    }
}

module.exports={
    viewCoupen,
    addCoupen,
    blockUnblock,
    editCoupen,
    updateCoupen
}