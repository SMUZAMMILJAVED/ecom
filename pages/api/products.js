
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
   
   await mongooseConnect();
   await isAdminRequest(req,res);
      if(req.method==="GET"){
         if(req.query?.id){
            res.json(await Product.findOne({_id:req.query.id}))
         }else{
            res.json(await Product.find());
         }
     
   }
    if(req.method==="POST"){
        const{title,description,price,images,category,properties}=req.body;
     const productDoc=  await Product.create({
        title,description,price,images,category:category||null,properties
       });
       res.json(productDoc);
    }
    if(req.method==="PUT"){
      const{title,description,price,images,_id,category,properties}=req.body;
     await Product.updateOne({_id},{title,description,price,images,category:category||null,properties});
     res.json(true)
    }
    if(req.method==="DELETE"){
      if(req.query?.id){
         await Product.deleteOne({_id:req.query?.id});
         res.json(true);
      }
    }
  }
  