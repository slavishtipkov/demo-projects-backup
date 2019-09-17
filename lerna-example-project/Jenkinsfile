def tempcommit
pipeline {
    agent none
    stages {
        stage ("Checkout SCM and test tools") {
                agent any
           steps {
              checkout scm
                script {
                   def branch = env.BRANCH_NAME
                   def commit = sh (script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                   def tag
                        switch (branch) {
                           case 'master':
                                tag = 'master-' + commit
                                break
                           case 'development':
                                tag = 'development-' + commit
                                break
                           default:
                                tag = 'feature-' + commit
                                break
                        }
                   currentBuild.description = tag
              }
           }
        }
        stage('Build') {
                agent any
            steps {
                echo 'Building..'
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
                script {
                  switch (env.BRANCH_NAME) {
                    case 'master':
                    case 'release':
                      sh "npm install -g typescript; npm install"
                      sh "npm run build"
                      sh "npm run build:docs"
                      break

                    default:
                      echo "not main branch"
                  }
                }
            }
        }

        stage('Deploy To QA and AWS PRE from master') {
            agent any
            when { branch 'master' }
            steps {
              script {
                if (env.BRANCH_NAME == 'master') {
                  echo 'Deploying on the dev environment...'
                  tempcommit = sh (script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                  // creates a sample file to test deployment with:
                  // sh 'mkdir -p packages/output ; touch packages/output/arbfile'
                  // sh 'cd ./packages;  find . -maxdepth 2 -name dist -type d -exec rsync -avR {} root@az-ag-qawidget-dev01.dtn.com:/var/www/html ";"'
                  // sh """ ssh root@az-ag-qawidget-dev01.dtn.com 'chown apache:apache /var/www/html -R' """
                  sh 'cd ./widgets-build/;  find . -maxdepth 2 -name dist -type d -exec rsync -avR {} output ";"'
                  sh "ls -la ./widgets-build/"
                  dir ('./widgets-build/') {
                    pwd();
                    withAWS(region:'us-east-1',credentials:'PRE S3 Buckets') {
                      def identity=awsIdentity();
                      s3Upload(bucket:"pre-content-services.dtn.com", path:"ui-widgets/", workingDir:'.', includePathPattern:'**/*');
                    }
                  }
                  dir ('./docs-site/') {
                    pwd();
                    withAWS(region:'us-east-1',credentials:'PRE S3 Buckets') {
                      def identity=awsIdentity();
                      s3Upload(bucket:"pre-cs-widget-docs.dtn.com", workingDir:'.', includePathPattern:'**/*');
                    }
                  }
                } else {
                  echo 'This is a feature branch, will not be deployed to environment'
                }
              }
            }
            post {
             success {  echo " deployed to aws pre" }
             failure { deleteDir() }
            }

       }


        stage('Deploy To PROD From release') {
            agent any
            when { branch 'release' }
            steps {
                script {
                  if (env.BRANCH_NAME == 'release') {
                    echo 'I will deploy on the Prod AWS bucket environment.'
                    dir ('./widgets-build/') {
                     pwd();
                      withAWS(region:'us-east-1',credentials:'PROD S3 Bucket') {
                        def identity=awsIdentity();
                        s3Upload(bucket:"content-services.dtn.com", path:"ui-widgets/", workingDir:'.', includePathPattern:'**/*');
                      }
                    }
                    dir ('./docs-site/') {
                      pwd();
                      withAWS(region:'us-east-1',credentials:'PROD S3 Bucket') {
                        def identity=awsIdentity();
                        s3Upload(bucket:"cs-widget-docs.dtn.com", workingDir:'.', includePathPattern:'**/*');
                      }
                    }
                  } else {
                    echo 'This is a feature branch, will not be deployed to environment';
                  }

                }
            }
	    post {
             success {  echo "deployed to aws prod" }
	     failure { deleteDir() }
      	    }
       }


  }

}
node {
   cleanWs()
}
