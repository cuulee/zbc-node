// Copyright © 2018 Camunda Services GmbH (info@camunda.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { clientDefaultOptions } = require('./__internal/options')

const FFILib = require('./FFILib')
const JobClient = require('./JobClient')
const TopicClient = require('./TopicClient')
const WorkflowClient = require('./WorkflowClient')

class Client {
  constructor (options = {}) {
    this.LatestVersion = -1

    this.ffiLib = new FFILib()

    this.jobClient = new JobClient(this.ffiLib)
    this.workflowClient = new WorkflowClient(this.ffiLib)
    this.topicClient = new TopicClient(this.ffiLib)

    this._initClient(options)
  }

  _initClient (options) {
    const clientOptions = Object.assign(clientDefaultOptions, options)

    const status = this.ffiLib.zbc.InitClient(this.ffiLib.structs.newGoString(clientOptions.bootstrapAddr))
    if (status.error) {
      console.error(`Error connecting to client with given bootstrap Address: ${clientOptions.bootstrapAddr}`)
    }
  }

  /**
   * Creates a topic with given partitionNumber and replicationFactor.
   * @param {string} topicName - TopicName
   * @param {int=} partitionCount
   * @param {int=} replicationFactor
   * @return {Object}
   */
  createTopic (topicName, partitionCount, replicationFactor) {
    return this.topicClient.createTopic(topicName, partitionCount, replicationFactor)
  }

  /**
   * Create a Workflow Instance for given bpmnProcessId and version.
   * @param {string} topicName
   * @param {string} bpmnProcessId
   * @param {string} version
   * @param {string=} payload
   * @return {Object}
   */
  createWorkflowInstance (topicName, bpmnProcessId, version, payload) {
    return this.workflowClient.createWorkflowInstance(topicName, bpmnProcessId, version, payload)
  }

  /**
   * Create / Deploy a given workflow (xml).
   * @param {string} topicName
   * @param {string} fileName
   * @return {Object}
   */
  createWorkflow (topicName, fileName) {
    return this.workflowClient.createWorkflow(topicName, fileName)
  }

  /**
   * Creates a job worker.
   * @param {string} topicName
   * @param {string} jobType
   * @param {Object} options
   * @param {function} callback
   * @return {Object}
   */
  jobWorker (topicName, jobType, options, callback) {
    return this.jobClient.createJobWorker(topicName, jobType, options, callback)
  }

  /**
   * Completes a job by given jobKey and payload.
   * @param {string} jobKey
   * @param {JSONObject} payload
   * @return {Object}
   */
  completeJob (jobKey, payload) {
    return this.jobClient.completeJob(jobKey, payload)
  }

  /**
   * Fails a job by given jobKey.
   * @param {string} jobKey
   * @return {Object}
   */
  failJob (jobKey) {
    return this.jobClient.failJob(jobKey)
  }
}

module.exports = Client
