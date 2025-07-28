pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'                         // Change if using another region
        AWS_ACCOUNT_ID = '841162688608'             // Replace with your AWS account ID
        REPO_NAME = 'banking-app'
        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}"
    }

    tools {
        sonarQube 'SonarScanner'                         // Match name from Jenkins Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/<your-username>/banking-app.git'
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {          // Match name from Jenkins System Config
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${REPO_NAME}:latest")
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI
                    docker tag ${REPO_NAME}:latest $ECR_URI:latest
                    docker push $ECR_URI:latest
                    '''
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh '''
                aws ecs update-service \
                  --cluster banking-cluster \
                  --service banking-service \
                  --force-new-deployment \
                  --region $AWS_REGION
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build and Deployment Successful!"
        }
        failure {
            echo "❌ Build or Deployment Failed!"
        }
    }
}
