pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "sugamkuma567/student-management-app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '''
                docker build -t %DOCKER_IMAGE%:%BUILD_NUMBER% .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                bat '''
                docker push %DOCKER_IMAGE%:%BUILD_NUMBER%
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat '''
                kubectl set image deployment/student-management-app student-management-app=%DOCKER_IMAGE%:%BUILD_NUMBER%
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '''
                kubectl rollout status deployment/student-management-app
                kubectl get pods
                '''
            }
        }
    }
}