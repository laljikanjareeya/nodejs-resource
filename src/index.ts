/*!
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  GoogleAuthOptions,
  Operation,
  Service,
  Metadata,
  ApiError,
} from '@google-cloud/common';
import {paginator} from '@google-cloud/paginator';
import {promisifyAll} from '@google-cloud/promisify';

import {Project} from './project';

export type PagedResponse<Item, Response> =
  | [Item[]]
  | [Item[], {} | null, Response];

export type RequestCallback<T, R = void> = R extends void
  ? NormalCallback<T>
  : PagedCallback<T, R>;

export interface NormalCallback<TResponse> {
  (err: ApiError | null, res?: TResponse | null): void;
}

export interface PagedCallback<Item, Response> {
  (
    err: ApiError | null,
    results?: Item[] | null,
    nextQuery?: {} | null,
    response?: Response | null
  ): void;
}

export type CreateProjectCallback = (
  err: Error | null,
  project?: Project | null,
  operation?: Operation<Project>,
  apiResponse?: Metadata
) => void;
export type CreateProjectResponse = [Project, Operation<Project>, Metadata];
export type GetProjectsResponse = [Project[], Metadata];
export type GetProjectsCallback = (
  err: Error | null,
  projects?: Project[] | null,
  nextQuery?: {} | null,
  apiResponse?: Metadata
) => void;

export interface GetProjectOptions {
  autoPaginate?: boolean;
  filter?: string;
  maxApiCalls?: number;
  maxResults?: number;
  pageSize?: number;
  pageToken?: string;
}

export enum LifecycleState {
  /**
   * 	Unspecified state. This is only used/useful for distinguishing unset
   * values.
   */
  'LIFECYCLE_STATE_UNSPECIFIED',
  /**
   * 	The normal and active state.
   */
  'ACTIVE',
  /**
   * 	The project has been marked for deletion by the user (by invoking
   * projects.delete) or by the system (Google Cloud Platform). This can
   * generally be reversed by invoking projects.undelete.
   */
  'DELETE_REQUESTED',
  /**
   * 	This lifecycle state is no longer used and not returned by the API.
   */
  'DELETE_IN_PROGRESS',
}

export interface CreateProjectOptions {
  projectNumber?: string;
  projectId?: string;
  lifecycleState?: LifecycleState;
  name: string;
  createTime: string;
  labels: {[index: string]: string};
  parent: {type: string; id: string};
}

/**
 * @typedef {object} ClientConfig
 * @property {string} [projectId] The project ID from the Google Developer's
 *     Console, e.g. 'grape-spaceship-123'. We will also check the environment
 *     variable `GCLOUD_PROJECT` for your project ID. If your app is running in
 *     an environment which supports {@link
 * https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application
 * Application Default Credentials}, your project ID will be detected
 * automatically.
 * @property {string} [keyFilename] Full path to the a .json, .pem, or .p12 key
 *     downloaded from the Google Developers Console. If you provide a path to a
 *     JSON file, the `projectId` option above is not necessary. NOTE: .pem and
 *     .p12 require you to specify the `email` option as well.
 * @property {string} [email] Account email address. Required when using a .pem
 *     or .p12 keyFilename.
 * @property {object} [credentials] Credentials object.
 * @property {string} [credentials.client_email]
 * @property {string} [credentials.private_key]
 * @property {boolean} [autoRetry=true] Automatically retry requests if the
 *     response is related to rate limits or certain intermittent server errors.
 *     We will exponentially backoff subsequent requests by default.
 * @property {number} [maxRetries=3] Maximum number of automatic retries
 *     attempted before returning the error.
 * @property {Constructor} [promise] Custom promise module to use instead of
 *     native Promises.
 */
export interface ClientConfig extends GoogleAuthOptions {
  autoRetry?: boolean;
  maxRetries?: boolean;
  /**
   * The API endpoint of the service used to make requests.
   * Defaults to `cloudresourcemanager.googleapis.com`.
   */
  apiEndpoint?: string;
}

/**
 * The [Cloud Resource Manager](https://cloud.google.com/resource-manager/)
 * provides methods that you can use to programmatically manage your projects
 * in the Google Cloud Platform. With this API, you can do the following:
 *
 *   - Get a list of all projects associated with an account.
 *   - Create new projects.
 *   - Update existing projects.
 *   - Delete projects.
 *   - Recover projects.
 *
 * @class
 *
 * @see [What is the Cloud Resource Manager?]{@link https://cloud.google.com/resource-manager}
 *
 * @param {ClientConfig} [options] Configuration options.
 *
 * @example <caption>Import the client library</caption>
 * const {Resource} = require('@google-cloud/resource');
 *
 * @example <caption>Create a client that uses <a
 * href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application
 * Default Credentials (ADC)</a>:</caption> const resource = new Resource();
 *
 * @example <caption>Create a client with <a
 * href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit
 * credentials</a>:</caption> const resource = new Resource({ projectId:
 * 'your-project-id', keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:resource_quickstart
 * Full quickstart example:
 */
class Resource extends Service {
  getProjectsStream: Function;
  constructor(options: ClientConfig = {}) {
    options.apiEndpoint =
      options.apiEndpoint || 'cloudresourcemanager.googleapis.com';
    const config = {
      apiEndpoint: options.apiEndpoint,
      baseUrl: `https://${options.apiEndpoint}/v1`,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      projectIdRequired: false,
      packageJson: require('../../package.json'),
    };
    super(config, options);

    /**
     * Get a list of {@link Resource/project} objects as a readable object
     * stream.
     *
     * @param {object} query Configuration object. See
     *     {@link Resource#getProjects} for a complete list of options.
     * @return {stream}
     *
     * @example
     * const {Resource} = require('@google-cloud/resource');
     * const resource = new Resource();
     *
     * resource.getProjectsStream()
     *   .on('error', console.error)
     *   .on('data', project => {
     *     // `project` is a `Project` object.
     *   })
     *   .on('end', () => {
     *     // All projects retrieved.
     *   });
     *
     * //-
     * // If you anticipate many results, you can end a stream early to prevent
     * // unnecessary processing and API requests.
     * //-
     * resource.getProjectsStream()
     *   .on('data', function(project) {
     *     this.end();
     *   });
     */
    this.getProjectsStream = paginator.streamify('getProjects');
  }

  createProject(
    id: string,
    options?: CreateProjectOptions
  ): Promise<CreateProjectResponse>;
  createProject(
    id: string,
    options: CreateProjectOptions,
    callback: CreateProjectCallback
  ): void;
  createProject(id: string, callback: CreateProjectCallback): void;
  /**
   * Create a project.
   *
   * **This method only works if you are authenticated as yourself, e.g. using
   * the gcloud SDK.**
   *
   * @see [Projects Overview]{@link https://cloud.google.com/compute/docs/networking#networks}
   * @see [projects: create API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/create}
   *
   * @param {string} id ID of the project.
   * @param {object} [options] See a
   *     [Project
   * resource](https://cloud.google.com/resource-manager/reference/rest/v1/projects#Project).
   * @param {function} [callback] The callback function.
   * @param {?error} callback.err An error returned while making this request.
   * @param {Project} callback.project The created Project
   *     object.
   * @param {object} callback.apiResponse The full API response.
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * const id = 'new-project-id';
   *
   * resource.createProject(id, (err, project, operation, apiResponse) => {
   *   if (err) {
   *     // Error handling omitted.
   *   }
   *
   *   // `project` is a new Project instance.
   *   // `operation` will emit `error` or `complete` when the status updates.
   *
   *   operation
   *     .on('error', err => {})
   *     .on('complete', () => {
   *       // Project was created successfully!
   *     });
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * resource.createProject(id)
   *   .then(data => {
   *     const project = data[0];
   *     const operation = data[1];
   *     const apiResponse = data[2];
   *
   *     return operation.promise();
   *   })
   *   .then(data => {
   *     const operationMetadata = data[0];
   *
   *     // Project created successfully!
   *   });
   */
  createProject(
    id: string,
    optionsOrCallback?: CreateProjectOptions | CreateProjectCallback,
    callback?: CreateProjectCallback
  ): void | Promise<CreateProjectResponse> {
    const options =
      typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
    callback =
      typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
    this.request(
      {
        method: 'POST',
        uri: '/projects',
        json: Object.assign({}, options, {
          projectId: id,
        }),
      },
      (err, resp) => {
        if (err) {
          callback!(err, null, resp);
          return;
        }
        const project = this.project(resp.projectId);
        const operation = this.operation(resp.name);
        operation.metadata = resp;
        callback!(null, project, operation, resp);
      }
    );
  }

  getProjects(options?: GetProjectOptions): Promise<GetProjectsResponse>;
  getProjects(options: GetProjectOptions, callback: GetProjectsCallback): void;
  getProjects(callback: GetProjectsCallback): void;
  /**
   * Get a list of projects.
   *
   * @see [Projects Overview]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects}
   * @see [projects: list API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/list}
   *
   * @param {object} [options] Operation search options.
   * @param {boolean} [options.autoPaginate] Have pagination handled
   *     automatically. Default: true.
   * @param {string} [options.filter] An expression for filtering the results.
   * @param {number} [options.maxApiCalls] Maximum number of API calls to make.
   * @param {number} [options.maxResults] Maximum number of results to return.
   * @param {number} [options.pageSize] Maximum number of projects to return.
   * @param {string} [options.pageToken] A previously-returned page token
   *     representing part of the larger set of results to view.
   * @param {function} callback The callback function.
   * @param {?error} callback.err An error returned while making this request.
   * @param {Project[]} callback.operations Project objects from
   *     your account.
   * @param {object} callback.apiResponse The full API response.
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * resource.getProjects((err, projects) => {
   *   // `projects` is an array of `Project` objects.
   * });
   *
   * //-
   * // To control how many API requests are made and page through the results
   * // manually, set `autoPaginate` to `false`.
   * //-
   * function callback(err, projects, nextQuery, apiResponse) {
   *   if (nextQuery) {
   *     // More results exist.
   *     resource.getProjects(nextQuery, callback);
   *   }
   * }
   *
   * resource.getProjects({
   *   autoPaginate: false
   * }, callback);
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * resource.getProjects().then(data => {
   *   const projects = data[0];
   * });
   */
  getProjects(
    optionsOrCallback?: GetProjectOptions | GetProjectsCallback,
    callback?: GetProjectsCallback
  ): void | Promise<GetProjectsResponse> {
    const options =
      typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
    callback =
      typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
    this.request(
      {
        uri: '/projects',
        qs: options,
      },
      (err, resp) => {
        if (err) {
          callback!(err, null, null, resp);
          return;
        }

        let nextQuery: GetProjectOptions;

        if (resp.nextPageToken) {
          nextQuery = Object.assign({}, options, {
            pageToken: resp.nextPageToken,
          });
        }

        const projects = (resp.projects || []).map((project: Project) => {
          const projectInstance = this.project(project.projectId);
          projectInstance.metadata = project;
          return projectInstance;
        });

        callback!(null, projects, nextQuery!, resp);
      }
    );
  }

  /*! Developer Documentation
   *
   * @returns {module:common/operation}
   */
  /**
   * Get a reference to an existing operation.
   *
   * @throws {Error} If a name is not provided.
   *
   * @param {string} name The name of the operation.
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * const operation = resource.operation('68850831366825');
   */
  operation(name: string) {
    if (!name) {
      throw new Error('A name must be specified for an operation.');
    }
    return new Operation<Project>({parent: this, id: name});
  }

  /**
   * Create a Project object. See {@link Resource#createProject} to create
   * a project.
   *
   * @throws {Error} If an ID is not provided.
   *
   * @param {string} id The ID of the project (eg: `grape-spaceship-123`).
   * @return {Project}
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   *
   * const project = resource.project('grape-spaceship-123');
   */
  project(id?: string) {
    id = id || this.projectId;
    if (!id) {
      throw new Error('A project ID is required.');
    }
    return new Project(this, id);
  }
}

/*! Developer Documentation
 *
 * These methods can be auto-paginated.
 */
paginator.extend(Resource, ['getProjects']);

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Resource, {
  exclude: ['operation', 'project'],
});

/**
 * {@link Project} class.
 *
 * @name Resource.Project
 * @see Project
 * @type {constructor}
 */
export {Project};

/**
 * The default export of the `@google-cloud/resource` package is the
 * {@link Resource} class.
 *
 * See {@link Resource} and {@link ClientConfig} for client methods and
 * configuration options.
 *
 * @module {constructor} @google-cloud/resource
 * @alias nodejs-resource
 *
 * @example <caption>Install the client library with <a
 * href="https://www.npmjs.com/">npm</a>:</caption> npm install --save
 * @google-cloud/resource
 *
 * @example <caption>Import the client library</caption>
 * const {Resource} = require('@google-cloud/resource');
 *
 * @example <caption>Create a client that uses <a
 * href="https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application">Application
 * Default Credentials (ADC)</a>:</caption> const resource = new Resource();
 *
 * @example <caption>Create a client with <a
 * href="https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually">explicit
 * credentials</a>:</caption> const resource = new Resource({ projectId:
 * 'your-project-id', keyFilename: '/path/to/keyfile.json'
 * });
 *
 * @example <caption>include:samples/quickstart.js</caption>
 * region_tag:resource_quickstart
 * Full quickstart example:
 */
export {Resource};
