const router=require('express').Router()
const Product=require('../models/Product')
router.put('/:id',async(req,res)=>{
 const data=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
 res.json(data)
})
router.delete('/:id',async(req,res)=>{
 await Product.findByIdAndDelete(req.params.id)
 res.json('Deleted')
})
module.exports=router