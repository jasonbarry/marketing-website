pipeline {
   environment {
          // if (env.BRANCH_NAME == 'dev'){
                MAILCHIMP_DOMAIN = credentials('MAILCHIMP_DOMAIN_DEV')
                MAILCHIMP_FORM_ID = credentials('MAILCHIMP_FORM_ID_DEV')
                MAILCHIMP_LIST_ID = credentials('MAILCHIMP_LIST_ID_DEV')
                SEGMENT_ID = credentials('SEGMENT_ID_DEV')
                STRIPE_SECRET_KEY = credentials('STRIPE_SECRET_KEY_DEV')
                TEST_ASSIGN = "okdude"
          // }
          // if (env.BRANCH_NAME == 'master'){
          //       MAILCHIMP_DOMAIN = credentials('MAILCHIMP_DOMAIN')
          //       MAILCHIMP_FORM_ID = credentials('MAILCHIMP_FORM_ID')
          //       MAILCHIMP_LIST_ID = credentials('MAILCHIMP_LIST_ID')
          //       SEGMENT_ID = credentials('SEGMENT_ID')
          //       STRIPE_SECRET_KEY = credentials('STRIPE_SECRET_KEY')
          // }
        }




    stage('Clone repository') {

      if  (!(env.BRANCH_NAME =~ /(dev|master|PR-)/)){
        // Only Build PRs, Dev, and Master, don't build on branch push
             echo "Not master, dev, or a PR-* so not building"
             currentBuild.result = 'SUCCESS'
             return
      }


        step([$class: 'WsCleanup'])
        checkout scm
    }

    stage('Build') {
        def projectName = "marketing-website"
        def gcloudProject = "featurepeek-228719"
        def gcr_path = "gcr.io/${gcloudProject}/${projectName}"
        def container
        def imageTag
        def branchTag

         sh 'printenv'
        // if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'dev'){
            def branchReplaced = env.BRANCH_NAME.toLowerCase().replaceAll("\\/", "-")
            branchTag = "${gcr_path}:${branchReplaced}"
            imageTag = "${gcr_path}:${branchReplaced}-${env.BUILD_ID}"
            container = docker.build(imageTag, ".")
        // }
    }
  
    stage('push to gcr.io') {
        if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'dev') {
            sh "docker tag ${imageTag} ${branchTag}"
            sh "gcloud docker -- push ${imageTag}"
            sh "gcloud docker -- push ${branchTag}"       
        } 
    }

    stage('deploy') {
        milestone()

        if (env.BRANCH_NAME == 'dev'){
            echo 'Getting Kube context for dev cluster'
            sh "gcloud container clusters get-credentials featurepeek-dev --zone us-central1-a --project ${gcloudProject}"
        }

        if (env.BRANCH_NAME == 'master'){
            echo 'Getting Kube context for prod cluster'
            sh "gcloud container clusters get-credentials featurepeek-prod --zone us-central1-a --project ${gcloudProject}"
        }

        sh "kubectl set image deployment/${projectName} ${projectName}=${imageTag}"

    }

  
}
