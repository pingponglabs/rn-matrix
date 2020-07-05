#!/bin/bash
echo Did you remember to comment out the Example App? [y/n]
read answer 

if [ $answer = 'y' ]
then
 echo Cool, publishing...
 npm publish --registry http://registry.npmjs.org/
fi