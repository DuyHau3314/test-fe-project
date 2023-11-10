#!/bin/bash

# Change to the problem2 directory and install dependencies
cd problem2
if [ $? -ne 0 ]; then
    echo "Failed to change directory to problem2"
    exit 1
fi

yarn install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies in problem2"
    exit 1
fi

# Start the development server for problem2 in the background
yarn dev &
if [ $? -ne 0 ]; then
    echo "Failed to start development server for problem2"
    exit 1
fi

# Get back to the parent directory
cd ..

# Change to the problem3 directory and install dependencies
cd problem3
if [ $? -ne 0 ]; then
    echo "Failed to change directory to problem3"
    exit 1
fi

yarn install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies in problem3"
    exit 1
fi

# Script ends here, problem2 dev server will continue running in the background
