pipeline {
agent any

environment {
    FRONTEND_IMAGE = 'roshna21/chat-frontend'
    BACKEND_IMAGE  = 'roshna21/chat-backend'
}

stages {

    stage('Clone Repository') {
        steps {
            git branch: 'main',
            url: 'https://github.com/roshna21/New_Devops_project.git'
        }
    }

    stage('Install Frontend Dependencies') {
        steps {
            dir('frontend') {
                bat 'npm install'
            }
        }
    }

    stage('Install Backend Dependencies') {
        steps {
            dir('backend') {
                bat 'npm install'
            }
        }
    }

    stage('Build Frontend') {
        steps {
            dir('frontend') {
                bat 'npm run build'
            }
        }
    }

    stage('OWASP Dependency Check') {
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

    stage('SonarQube Analysis') {
        steps {
            bat '''
            sonar-scanner.bat ^
            -D"sonar.projectKey=chat-app" ^
            -D"sonar.projectName=chat-app" ^
            -D"sonar.sources=." ^
            -D"sonar.host.url=http://localhost:9000" ^
            -D"sonar.token=sqp_5c9b07c690ad567707d574d0a29ec7e84b58c13c"
            '''
        }
    }

    stage('Build Frontend Docker Image') {
        steps {
            bat 'docker build -t %FRONTEND_IMAGE% ./frontend'
        }
    }

    stage('Build Backend Docker Image') {
        steps {
            bat 'docker build -t %BACKEND_IMAGE% ./backend'
        }
    }

    stage('Docker Login & Push') {
        steps {
            withCredentials([usernamePassword(
                credentialsId: 'Dockerhub',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {

                bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'

                bat 'docker tag %FRONTEND_IMAGE% %FRONTEND_IMAGE%:latest'
                bat 'docker push %FRONTEND_IMAGE%:latest'

                bat 'docker tag %BACKEND_IMAGE% %BACKEND_IMAGE%:latest'
                bat 'docker push %BACKEND_IMAGE%:latest'
            }
        }
    }

    stage('Deployment') {
        steps {
            echo 'Deployment Stage Completed'
        }
    }
}

post {
    success {
        echo 'Pipeline Executed Successfully'
    }

    failure {
        echo 'Pipeline Failed'
    }
}

}
