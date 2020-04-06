/*!
 * Copyright 2015 Google LLC
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
  Operation,
  ServiceObject,
  util,
  Metadata,
  ApiError,
} from '@google-cloud/common';
import {promisifyAll} from '@google-cloud/promisify';

import {CreateProjectCallback, CreateProjectResponse, Resource} from '.';

export type RestoreCallback = (
  err: Error | null,
  apiResonse?: Metadata
) => void;
export type RestoreResponse = [Metadata];

export type ProjectCreateResponse = [Project, Operation<Project>, Metadata];
export interface ProjectCreateCallback {
  (
    err: Error | null,
    project?: Project,
    operation?: Operation<Project>,
    apiResponse?: Metadata
  ): void;
}

export interface Expression {
  expression: string;
  title: string;
  description: string;
  location: string;
}
export interface Binding {
  role: string;
  members: string[];
  condition: Expression;
}
export interface AuditLogConfig {
  logType: string;
  exemptedMembers: string[];
}
export interface AuditConfig {
  service: string;
  auditLogConfigs: AuditLogConfig[];
}

export interface Policy {
  bindings: Binding[];
  auditConfigs: AuditConfig[];
  etag: string;
  version: number;
}

export type GetIamPolicyResponse = [Policy];
export interface GetIamPolicyCallback {
  (err: Error | null, policy?: Policy): void;
}
export interface GetIamPolicyOptions {
  requestedPolicyVersion: number;
}
export interface Ancestry {
  ancestor: Ancestor[];
}
export interface Ancestor {
  resourceId: ResourceId;
}
export interface ResourceId {
  id: string;
  type: string;
}

export type GetAncestryResponse = [Ancestry];
export interface GetAncestryCallback {
  (err: ApiError | null, ancestry?: Ancestry): void;
}

/**
 * A Project object allows you to interact with a Google Cloud Platform project.
 *
 * @see [Projects Overview]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects}
 * @see [Project Resource]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects#Project}
 *
 * @class
 * @param {Resource} resource {@link Resource} object this project belongs to.
 * @param {string} id The project's ID.
 *
 * @example
 * const {Resource} = require('@google-cloud/resource');
 * const resource = new Resource();
 * const project = resource.project('grape-spaceship-123');
 */
class Project extends ServiceObject {
  projectId?: string;
  constructor(resource: Resource, id: string) {
    const methods = {
      /**
       * Create a project.
       *
       * @method Project#create
       * @param {object} [config] See {@link Resource#createProject}.
       *
       * @example
       * const {Resource} = require('@google-cloud/resource');
       * const resource = new Resource();
       * const project = resource.project('grape-spaceship-123');
       *
       * project.create((err, project, operation, apiResponse) => {
       *   if (err) {
       *     // Error handling omitted.
       *   }
       *
       *   // `operation` will emit `error` or `complete` when the status
       * updates.
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
       * project.create()
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
      create: true,

      /**
       * Delete the project.
       *
       * **This method only works if you are authenticated as yourself, e.g.
       * using the gcloud SDK.**
       *
       * @see [projects: delete API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/delete}
       *
       * @method Project#delete
       * @param {function} [callback] The callback function.
       * @param {?error} callback.err An error returned while making this
       *     request.
       * @param {object} callback.apiResponse The full API response.
       *
       * @example
       * const {Resource} = require('@google-cloud/resource');
       * const resource = new Resource();
       * const project = resource.project('grape-spaceship-123');
       *
       * project.delete((err, apiResponse) => {
       *   if (!err) {
       *     // The project was deleted!
       *   }
       * });
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * project.delete().then((data) => {
       *   const apiResponse = data[0];
       * });
       */
      delete: true,

      /**
       * Check if the project exists.
       *
       * @method Project#exists
       * @param {function} callback The callback function.
       * @param {?error} callback.err An error returned while making this
       *     request.
       * @param {boolean} callback.exists Whether the project exists or not.
       *
       * @example
       * const {Resource} = require('@google-cloud/resource');
       * const resource = new Resource();
       * const project = resource.project('grape-spaceship-123');
       *
       * project.exists((err, exists) => {});
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * project.exists().then((data) => {
       *   const exists = data[0];
       * });
       */
      exists: true,

      /**
       * Get a project if it exists.
       *
       * You may optionally use this to "get or create" an object by providing
       * an object with `autoCreate` set to `true`. Any extra configuration that
       * is normally required for the `create` method must be contained within
       * this object as well.
       *
       * @method Project#get
       * @param {options} [options] Configuration object.
       * @param {boolean} [options.autoCreate=false] Automatically create the
       *     object if it does not exist.
       *
       * @example
       * const {Resource} = require('@google-cloud/resource');
       * const resource = new Resource();
       * const project = resource.project('grape-spaceship-123');
       *
       * project.get((err, project, apiResponse) => {
       *   // `project.metadata` has been populated.
       * });
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * project.get().then((data) => {
       *   const project = data[0];
       *   const apiResponse = data[1];
       * });
       */
      get: true,

      /**
       * Get the metadata for the project.
       *
       * @see [projects: get API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/get}
       *
       * @method Project#getMetadata
       * @param {function} [callback] The callback function.
       * @param {?error} callback.err An error returned while making this
       *     request.
       * @param {?object} callback.metadata - Metadata of the project from the
       *     API.
       * @param {object} callback.apiResponse - Raw API response.
       *
       * @example
       * const {Resource} = require('@google-cloud/resource');
       * const resource = new Resource();
       * const project = resource.project('grape-spaceship-123');
       *
       * project.getMetadata((err, metadata, apiResponse) => {});
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * project.getMetadata().then((data) => {
       *   const metadata = data[0];
       *   const apiResponse = data[1];
       * });
       */
      getMetadata: true,

      /**
       * Set the project's metadata.
       *
       * **This method only works if you are authenticated as yourself, e.g.
       * using the gcloud SDK.**
       *
       * @see [projects: update API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/update}
       * @see [Project Resource]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects#Project}
       *
       * @method Project#setMetadata
       * @param {object} metadata See a
       *     [Project
       * resource](https://cloud.google.com/resource-manager/reference/rest/v1/projects#Project).
       * @param {function} [callback] The callback function.
       * @param {?error} callback.err An error returned while making this
       *     request.
       * @param {object} callback.apiResponse The full API response.
       *
       * @example
       * const {Resource} = require('@google-cloud/resource');
       * const resource = new Resource();
       * const project = resource.project('grape-spaceship-123');
       *
       * const metadata = {
       *   name: 'New name'
       * };
       *
       * project.setMetadata(metadata, (err, apiResponse) => {
       *   if (!err) {
       *     // The project has been successfully updated.
       *   }
       * });
       *
       * //-
       * // If the callback is omitted, we'll return a Promise.
       * //-
       * project.setMetadata(metadata).then((data) => {
       *   const apiResponse = data[0];
       * });
       */
      setMetadata: {
        reqOpts: {
          method: 'PUT',
        },
      },
    };

    super({
      parent: resource,
      baseUrl: '/projects',
      /**
       * @name Project#id
       * @type {string}
       */
      id,
      createMethod: resource.createProject.bind(resource),
      methods,
    });
  }

  create(): Promise<CreateProjectResponse>;
  create(callback: CreateProjectCallback): void;
  create(
    callback?: CreateProjectCallback
  ): void | Promise<CreateProjectResponse> {
    super.create(callback);
  }

  getIamPolicy(options?: GetIamPolicyOptions): Promise<GetIamPolicyResponse>;
  getIamPolicy(callback: GetIamPolicyCallback): void;
  getIamPolicy(
    options: GetIamPolicyOptions,
    callback: GetIamPolicyCallback
  ): void;
  /**
   * @typedef {array} GetIamPolicyResponse
   * @property {Policy} 0 This project's IAM [policy]{@link https://cloud.google.com/resource-manager/reference/rest/Shared.Types/Policy}.
   */
  /**
   * @callback GetIamPolicyCallback
   * @param {?Error} err Request error, if any.
   * @param {Policy} policy This project's IAM [policy]{@link https://cloud.google.com/resource-manager/reference/rest/Shared.Types/Policy}.
   */
  /**
   * Get the IAM policy for this project.
   *
   * @see [projects: getIamPolicy API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/getIamPolicy}
   *
   * @param {GetIamPolicyOptions} [options] Options object to get IAM policy.
   * @param {GetIamPolicyCallback} [callback] Callback function.
   * @returns {Promise<GetIamPolicyResponse>}
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   * const project = resource.project('grape-spaceship-123');
   *
   * project.getIamPolicy((err, policy) => {
   *   if (!err) {
   *     console.log(policy).
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * project.getIamPolicy().then((data) => {
   *   const policy = data[0];
   * });
   */
  getIamPolicy(
    optionsOrCallback?: GetIamPolicyCallback | GetIamPolicyOptions,
    callback?: GetIamPolicyCallback
  ): void | Promise<GetIamPolicyResponse> {
    const options =
      typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
    callback =
      typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;

    this.request(
      {
        method: 'POST',
        uri: ':getIamPolicy',
        body: {
          options,
        },
      },
      (err, resp) => {
        callback!(err, resp);
      }
    );
  }

  restore(): Promise<RestoreResponse>;
  restore(callback: RestoreCallback): void;
  /**
   * Restore a project.
   *
   * **This method only works if you are authenticated as yourself, e.g. using
   * the gcloud SDK.**
   *
   * @see [projects: undelete API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/undelete}
   *
   * @param {function} [callback] The callback function.
   * @param {?error} callback.err An error returned while making this request.
   * @param {object} callback.apiResponse Raw API response.
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   * const project = resource.project('grape-spaceship-123');
   *
   * project.restore((err, apiResponse) => {
   *   if (!err) {
   *     // Project restored.
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * project.restore().then((data) => {
   *   const apiResponse = data[0];
   * });
   */
  restore(callback?: RestoreCallback): void | Promise<RestoreResponse> {
    callback = callback || util.noop;
    this.request(
      {
        method: 'POST',
        uri: ':undelete',
      },
      (err, resp) => {
        callback!(err, resp);
      }
    );
  }

  getAncestry(): Promise<GetAncestryResponse>;
  getAncestry(callback: GetAncestryCallback): void;
  /**
   * @typedef {array} GetAncestryResponse
   * @property {Ancestry} 0 The new [ancestry]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/getAncestry#response-body}.
   */
  /**
   * @callback GetAncestryCallback
   * @param {?Error} err Request error, if any.
   * @param {Ancestry} ancestry The new [ancestry]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/getAncestry#response-body}.
   */
  /**
   * Get a list of ancestors in the resource.
   *
   * @see [projects: getAncestry API Documentation]{@link https://cloud.google.com/resource-manager/reference/rest/v1/projects/getAncestry}
   *
   * @param {GetAncestryCallback} [callback] Callback function.
   * @returns {Promise<GetAncestryResponse>}
   *
   * @example
   * const {Resource} = require('@google-cloud/resource');
   * const resource = new Resource();
   * const project = resource.project('grape-spaceship-123');
   *
   * project.getAncestry((err, ancestry) => {
   *   if (!err) {
   *     // console.log(ancestry).
   *   }
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * project.getAncestry().then((data) => {
   *   const ancestry = data[0];
   * });
   */
  getAncestry(
    callback?: GetAncestryCallback
  ): void | Promise<GetAncestryResponse> {
    callback = callback || util.noop;
    this.request(
      {
        method: 'POST',
        uri: ':getAncestry',
      },
      (err, resp) => {
        callback!(err, resp);
      }
    );
  }
}

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
promisifyAll(Project);

/**
 * Reference to the {@link Project} class.
 * @name module:@google-cloud/resource.Project
 * @see Project
 */
export {Project};
