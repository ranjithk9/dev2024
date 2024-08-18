pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        EMAIL_USER = credentials('email-user')
        EMAIL_PASS = credentials('email-pass')
    }
    tools {
        git 'Default' // Make sure this matches the name of the Git installation you configured in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ranjithk9/dev2024.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    def nodeHome = tool name: 'NodeJS', type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                deployToServer()
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/target/*.jar', allowEmptyArchive: true
            junit 'reports/**/*.xml'
        }
        success {
            emailext subject: 'Build Success: ${currentBuild.fullDisplayName}',
                      body: 'Build Successful: ${BUILD_URL}',
                      recipientProviders: [developers(), requestor()]
        }
        failure {
            emailext subject: 'Build Failed: ${currentBuild.fullDisplayName}',
                      body: 'Build Failed: ${BUILD_URL}',
                      recipientProviders: [developers(), requestor()]
        }
    }
}

def deployToServer() {
    // Define deployment steps here, e.g., SSH to your server and pull the latest code, restart service, etc.
    // Example:
    sh """
    ssh user@yourserver.com 'cd /path/to/app && git pull origin main && npm install && pm2 restart all'
    """
}
