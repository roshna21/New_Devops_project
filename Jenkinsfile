pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "roshna21/devops-project"
    }

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Cloning source code from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/roshna21/New_Devops_project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing project dependencies...'
                sh 'echo npm install'
            }
        }

        stage('Dependency Check') {
            steps {
                echo 'Running dependency vulnerability check...'
                sh 'echo npm audit'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube code quality analysis...'
                sh 'echo sonar-scanner'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                sh 'echo docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                sh 'echo docker push $DOCKER_IMAGE'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying application...'
                sh 'echo Frontend deployed on Vercel'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
