# Lambda Image Sharp
This lambda service resizes images. It generates multiple images of different sizes which could be used in the srcSet and sizes attributes in webpages.


## To Deploy
serverless deploy -v

1) Given an image and a desirable width (say `w`), it will create 6 images which are of width: 1/4w, 1/2w, w, 1.5w, 2w, and 3w

These image sizes can be used to provide optimised images on a website using the img html tag along with the sizes attributes.


2) Given an image and a desirable width (say `w`), it will create 4 images which are of width: w, 1.5w, 2w and 3w
These images can then be used in the srcSet as 
srcSet = "urlofimage1 1x, urlofimage2 1.5x, urlofimage3 2x, urlofimage4 3x" 
For responsive images, set the transformtype to be 'responsive' in the imgconfig.json

Example:
Lets say you want images of width : '200', '400', '800', '1200', '1600', '2400'

Update the imgconfig.json file:

  "output" : {
    "default" : {
       "outputdir": "defaulttest/",
       "maxWidth": "800"
     },
    "cover" : {
       "outputdir": "cover/",
       "maxWidth": "800",
     }
  }


In the above we are telling the service:
 - If the picture is in the input bucket, in a folder named "cover", then the resized image should go to a folder called "cover" in the output bucket. 
- Create images with the wdth assumed to be 800.

This then creates images with the width of 200, 400, 800, 1200, 1600 & 2400.

In your app/html you can dynamically evaluate the srcSet:

   let sizesArray=['200', '400', '800', '1200', '1600', '2400']
   let scSet;

   srcSet = sizesArray.map((size) => {
       return `urlofyourpicture ${size}w`
     }).reduce((total, value) => `${total},${value}`);
   }

Pass the srcSet to your images tag to get optimised pictures.


### Documentation:

image.js
It receives the initial events in processItem. It returns an array of promises, each promise resolves to one processed file 
It invokes the get from s3
It invokes the sharp API
It invokes the uploads to s3

s3.js
It has default source and destination buckets.
It implements the get from s3.
It implements the uploads to s3.

sharp.js
The sharp APIs


This is inspired by https://github.com/adieuadieu/serverless-sharp-image & https://github.com/gatsbyjs/gatsby/tree/4bc96cf82cee87f8e2d90a08a3db99ad96783ffd/packages/gatsby-plugin-sharp
