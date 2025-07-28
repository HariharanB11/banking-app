pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '841162688608'
        REPO_NAME = 'banking-app'
        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}"
        PATH = "/usr/local/bin:/usr/bin:/bin:$PATH" // Ensure aws is found
    }

    stages {
        stage('SonarQube Code Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
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
                    sh """
                        echo "🔐 Logging in to ECR..."
                        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI
                        
                        echo "🐳 Tagging and pushing Docker image to ECR..."
                        docker tag ${REPO_NAME}:latest $ECR_URI:latest
                        docker push $ECR_URI:latest
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh """
                    echo "🚀 Deploying to ECS..."
                    aws ecs update-service \
                      --cluster banking-cluster \
                      --service banking-service \
                      --force-new-deployment \
                      --region $AWS_REGION
                """
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


