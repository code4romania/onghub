#!/bin/bash

AWS_PROFILE=onghub-dev
IMAGE_NAME="onghub"
TAG="development"
REGISTRY="342026654050.dkr.ecr.eu-central-1.amazonaws.com"

AWS_PROFILE=${AWS_PROFILE} aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin ${REGISTRY}/${IMAGE_NAME}
docker build -t ${IMAGE_NAME}:${TAG} .
docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY}/${IMAGE_NAME}:${TAG} 
docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}