pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/roshna21/New_Devops_project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Dependency Check') {
            steps {
                sh 'npm audit || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t devops-project .'
            }
        }
    }
}
