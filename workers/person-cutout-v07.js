// MediaPipe's WASM loader uses importScripts, so this worker is classic.
var exports={};
const assetUrl=path=>new URL(`../${path}`,self.location.href).href;
importScripts(assetUrl('vendor/vision-bundle-v01032.js'));
const{FilesetResolver,ImageSegmenter}=exports;
let segmenter;
const maskCanvas=new OffscreenCanvas(256,256),maskInk=maskCanvas.getContext('2d');
const out=new OffscreenCanvas(640,480),ink=out.getContext('2d');
self.onmessage=async({data})=>{
 try{
  if(data.type==='init'){
   const files=await FilesetResolver.forVisionTasks(assetUrl('wasm'));
   segmenter=await ImageSegmenter.createFromOptions(files,{baseOptions:{modelAssetPath:assetUrl('models/selfie-segmenter-v1.tflite'),delegate:'CPU'},runningMode:'VIDEO',outputConfidenceMasks:true,outputCategoryMask:false});
   self.postMessage({type:'ready'});return;
  }
  if(data.type!=='frame'||!segmenter){data.bitmap?.close();return;}
  const bitmap=data.bitmap;
  try{segmenter.segmentForVideo(bitmap,data.time,result=>{
   const masks=result.confidenceMasks;
   if(!masks?.length)throw new Error('No person mask');
   const labels=segmenter.getLabels(),person=labels.findIndex(s=>/person|selfie|human/i.test(s));
   const mask=masks.length===1?masks[0]:masks[person>=0?person:1];
   if(maskCanvas.width!==mask.width||maskCanvas.height!==mask.height){maskCanvas.width=mask.width;maskCanvas.height=mask.height;}
   const values=mask.getAsFloat32Array(),pixels=maskInk.createImageData(mask.width,mask.height);let coverage=0;
   for(let i=0;i<values.length;i++){const x=Math.max(0,Math.min(1,(values[i]-.2)/.6)),a=x*x*(3-2*x);pixels.data[i*4+3]=Math.round(a*255);coverage+=a;}
   maskInk.putImageData(pixels,0,0);
   if(out.width!==bitmap.width||out.height!==bitmap.height){out.width=bitmap.width;out.height=bitmap.height;}
   ink.globalCompositeOperation='source-over';ink.clearRect(0,0,out.width,out.height);ink.drawImage(bitmap,0,0);
   ink.globalCompositeOperation='destination-in';ink.drawImage(maskCanvas,0,0,out.width,out.height);ink.globalCompositeOperation='source-over';
   const frame=out.transferToImageBitmap();self.postMessage({type:'frame',bitmap:frame,coverage:coverage/values.length},[frame]);
  });}finally{bitmap.close();}
 }catch(error){self.postMessage({type:'error',message:String(error)});}
};
