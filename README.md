# Blog Platform

A comprehensive blogging platform offering robust features for creating and managing blog posts, enhanced with user authentication, live post comment suggestions powered by OpenAI's GPT-3.5 Turbo, and a versatile chatbot for user engagement.

This Project is saving the data in the `elasticsearch` and also search for the data in the same database. So here is the `elasticswearch` setup.

## Elastic Search Setup

- Download the elasticsearch from the link give. [Elasticsearch](https://www.elastic.co/downloads/elasticsearch "Elasticseach Download ink")
- UnZip the file and copy it in the `C Drive` for example [`C:\elasticsearch-8.13.0`].
- Go to the `C:\elasticsearch-8.13.0\bin` and copy the path.
- Now, Paste the path you copy in the `environment variable>User variable>path` paste in the past section.
- Now start the elasticseatch using command `elasticsearc` in the  `command prompt` or `powershell` and end the server.
- Now, go to `C:\elasticsearch-8.13.0\config` and open `elasticsearch.yml` file and make the changes given below.
    - Note: That if you run the elasticsearch without doing below chnages then may be you need to put some extra effort to user elasticsearch using `username and password`. and also the elasticsearch will run on `https://localhost:9200`

        ```yml
        # Enable security features
        # Make it true to false
        xpack.security.enabled: false
        xpack.security.enrollment.enabled: false
        ```

    - Now add below code to allow the react server to use `elasticsearch`.

        ```yml
        # Make more chnages at the end of the file
        http.host: 0.0.0.0
        http.cors.enabled: true
        http.cors.allow-origin: "http://localhost:3000"
        ```

- After making all the changes run the server with the same command.
- Now open Another `command prompt` and run below command to create the index.

    ```bash
    curl -X PUT "http://localhost:9200/blogposts" -H 'Content-Type: application/json' -d'
     {
       "settings": {
         "number_of_shards": 1,
         "number_of_replicas": 1
       },
       "mappings": {
         "properties": {
           "id": { "type": "keyword" },
           "title": { "type": "text" },
           "content": { "type": "text" },
           "author": { "type": "text" },
           "category": { "type": "keyword" },
           "imageUrl": { "type": "text", "index": false },
           "createdAt": { "type": "date" }
         }
       }
     }
     '
    ```

- One all this done, you are ready to setup the react project and below are the instructions to setup the react project.

## React Project setup

- First clone this remo, Below is the link

    ```url
    https://github.com/yashpatel-py/UML-CSP-586-02-Blogging-Platform-Assignment-4
    ```

- Go to the folder where `package.json` file is present and run the command `npm install`.
- Now, start the server using command `npm start`.
- And also go to the folder `cd src/backend` and run command `node server.js`.
- And you are good to go.

## OPEN AI Setup

- This Project has some good features like chat bot and het comment suggestion.
- Now go to [open ai website](https://platform.openai.com/account/billing/overview) and add $5 in your account and do not turn on the auto reload.
- Now go [here](https://platform.openai.com/api-keys) and create the API key and save in the word file please.
- Now create `.env` file  where the `package.josn` and add below code in that.
    ```
    REACT_APP_OPENAI_API_KEY=PASTE_YOUR_API_KEY_HERE
    ```
- This Project is using `gpt-3.5-turbo` if OPENAI model.

## Some important notes

- You can see all your created posts `http://localhost:9200/blogposts/_search`.
- After all configuration if the project is not working then restart all the server again.
- Keep in mind that servers listed below shoild be up and running.
    - React servar
    - server.js
    - Elasticsearch