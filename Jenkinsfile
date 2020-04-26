pipeline {
  agent {
    node {
      label 'Ferinir'
    }
  }
  environment {
    IDENTIFIER = "${env.BRANCH_NAME == "master" ? "master" : "develop"}"
    PORT = "${env.BRANCH_NAME == "master" ? 7000 : 17000}"
  }
  
  stages {
    stage('Remove old docker image') {
      steps {
        script {
          try {
            sh 'docker stop cohelpfrontend_${IDENTIFIER}'
            sh 'docker container rm cohelpfrontend_${IDENTIFIER}'
          }
          catch(all) {
            print 'No docker containers ran previously'
          }
        }
      }
    }
    stage('Build CoHelp container') {
      steps {
        sh 'docker build --tag cohelpfrontend_${IDENTIFIER}:1.0 .'
      }
    }
    stage('Run CoHelp container') {
      steps {
        sh 'docker run --publish ${PORT}:80 --detach --name cohelpfrontend_${IDENTIFIER} cohelpfrontend_${IDENTIFIER}:1.0'
      }
    }
  }
}
