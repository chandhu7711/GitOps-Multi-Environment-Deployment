#!/bin/bash

set -e

echo "Deploying sample app to local Kubernetes..."

kubectl apply -k k8s/overlays/dev

echo "Waiting for deployment to become ready..."

kubectl rollout status deployment/sample-app -n dev

echo "Deployment completed successfully."

echo "Current pods:"
kubectl get pods -n dev

echo "Current service:"
kubectl get service -n dev

