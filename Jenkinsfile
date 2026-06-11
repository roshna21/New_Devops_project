pipeline {
    agent any

    environment {
        SONAR_TOKEN = 'sqp_e45c411e96ef8c167001bc31224d6fb49b368c9f'
        SONAR_HOST = 'http://host.docker.internal:9002'
        DOCKER_IMAGE = 'roshna21/devops-project'
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/roshna21/New_Devops_project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                if [ -d frontend ]; then
                    cd frontend
                    npm install
                    cd ..
                fi

                if [ -d backend ]; then
                    cd backend
                    npm install
                    cd ..
                fi
                '''
            }
        }


        stage('Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan .',
                                odcInstallation: 'OWASP-Dependency-Check'
            }
        }

        stage('Publish Dependency Report') {
            steps {
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t travel-planner-frontend ./frontend'
            }
        }
        stage('Docker Push') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {

            bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
            bat 'docker tag travel-planner-frontend yashaswinis4/travel-planner:latest'
            bat 'docker push yashaswinis4/travel-planner:latest'
        }
    }
}

    }

    post {
        success {
            echo 'Build Successful'
        }

        failure {
            echo 'Build Failed'
        }
    }
}
