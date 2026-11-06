import { expect } from "@playwright/test";
import axios from "axios";

export class JIRAHandler{


    /**
     * Description: Creates a new Jira issue using the provided project and issue details.
     * @param config - Configuration object containing the base URL, username, API token,
     * project key, issue type, summary, and description.
     * @returns The ID of the newly created Jira issue.
     */
    async POSTRequest(config: {
    baseUrl: string;
    username: string;
    apiToken: string;
    projectKey: string;
    issueType: string;
    summary:string;
    description:string
  }){
        let response = await axios.post(config.baseUrl,
            {
                "fields": {
                    "project": {
                        "key": config.projectKey
                    },
                    "summary": config.summary,
                    "description": config.description,
                    "issuetype": {
                        "name": config.issueType
                    }
                }
            },
            {
                "headers":{
                    "Content-Type" : "application/json"

                },
                "auth":{
                    "username" : config.username,
                    "password" : config.apiToken
                }
            }
        )

        // Assert successful creation and validate the returned issue ID
        expect(response.status).toBe(201);
        expect(response.data.id).toBeTruthy();
        

        return response.data.id
        

    }

    /**
     * Description: Retrieves an existing Jira issue using its ID or issue key.
     * @param config - Configuration object containing the base URL, username, API token,
     * project key, and issue ID or key.
     * @returns The retrieved Jira issue details.
     */
    async getRequest(config: { baseUrl: string;username: string; apiToken: string; projectKey: string;typeId: string}){

        let response = await axios.get(`${config.baseUrl}/${config.typeId}`,
           {
                "headers":{
                    "Content-Type" : "application/json"

                },
                "auth":{
                    "username" : config.username,
                    "password" : config.apiToken
                }
            } 
        )

        // Assert successful retrieval and verify the issue ID
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(config.typeId);

        return response.data

    }

    /**
     * Description: Updates the summary and description of an existing Jira issue.
     * @param config - Configuration object containing the base URL, username, API token,
     * issue ID or key, summary, and description.
     * @returns The HTTP response status after updating the issue.
     */
    async putRequest(config: { baseUrl: string;username: string; apiToken: string; projectKey: string;typeId: string;summary:string;description:string}){

        let response = await axios.put(`${config.baseUrl}/${config.typeId}`,
            {
                "fields": {
                   
                    "summary": config.summary,
                    "description": config.description,
                    
                }
            },
           {
                "headers":{
                    "Content-Type" : "application/json"

                },
                "auth":{
                    "username" : config.username,
                    "password" : config.apiToken
                }
            } 
        )

        console.log(response.status)

        expect(response.status).toBe(204);

        return response.status;

    }

    /**
     * Description: Deletes an existing Jira issue using its ID or issue key.
     * @param config - Configuration object containing the base URL, username, API token,
     * project key, and issue ID or key.
     * @returns The HTTP response status after deleting the issue.
     */
    async deleteRequest(config: { baseUrl: string;username: string; apiToken: string; projectKey: string;typeId: string}){

        let response = await axios.delete(`${config.baseUrl}/${config.typeId}`,
           {
                "headers":{
                    "Content-Type" : "application/json"

                },
                "auth":{
                    "username" : config.username,
                    "password" : config.apiToken
                }
            } 
        )

        console.log(response.status)

        // Jira issue deletion normally returns HTTP 204
        expect(response.status).toBe(204);

        return response.status;

    }


    
}