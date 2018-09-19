# CMSSDT IB page

This is source code for new [CMSSDT IB page](https://cmssdt.cern.ch/SDT/html/cmssdt-ib). It must be transpiled before deploying.

## To start
```sh
# you will need to install svn 

cd public/build
./updateData.sh
cd [project root]
npm install
npm run start 
```
