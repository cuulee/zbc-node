const ffi = require('ffi-napi');

const Structs = require('./__internal/Structs');
const {
  clientDefaultOptions,
  ffiInterface
} = require('./__internal/options');
const JobClient = require('./JobClient');
const TopicClient = require('./TopicClient');
const WorkflowClient = require('./WorkflowClient');

class Client {
  constructor() {
    //console.log(ffiInterface)
    this.zbc = ffi.Library(__dirname + '/obj/zbc.so', ffiInterface);

    this.jobClient = new JobClient(this.zbc);
    this.workflowClient = new WorkflowClient(this.zbc);
    this.topicClient = new TopicClient(this.zbc);
  }

  /**
   * Connect to Zeebe with given options.
   * @param {JSONObject={}} options
   * @return {boolean}
   */
  connect(options = {}) {
    const clientOptions = Object.assign(clientDefaultOptions, options);
  //  console.log(clientOptions.bootstrapAddr);
    const addr = Structs.newGoString(clientOptions.bootstrapAddr);
  //  console.log(addr);
    const status = this.zbc.InitClient(addr);
    console.log(status);
  }

  /**
   * Creates a topic with given partitionNumber and replicationFactor.
   * @param {string} topicName - TopicName
   * @param {int=} partitionCount
   * @param {int=} replicationFactor
   */
  createTopic(topicName, partitionCount, replicationFactor) {
    return this.topicClient.createTopic(topicName, partitionCount, replicationFactor);
  }

  /**
   * Create a Workflow Instance for given bpmnProcessId and version.
   * @param {string} topicName
   * @param {string} bpmnProcessId
   * @param {string} version
   * @param {string=} payload
   */
  createWorklfowInstance(topicName, bpmnProcessId, version, payload) {
    return this.workflowClient.createWorkflowInstance(topicName, bpmnProcessId, version, payload);
  }

  /**
   * Create / Deploy a given workflow (xml).
   * @param {string} topicName
   * @param {string} resourceName
   * @param {string} resource
   */
  createWorkflow(topicName, resourceName, resource) {
    return this.workflowClient.createWorkflow(topicName, resourceName, resource);
  }

  /**
   * Creates a job worker.
   * @param {string} topicName
   * @param {string} jobType
   * @param {Object} options
   * @param {function} callback
   */
  jobWorker(topicName, jobType, options, callback) {
    return this.jobClient.createJobWorker(topicName, jobType, options, callback);
  }

  /**
   * Completes a job by given jobKey and payload.
   * @param {string} jobKey
   * @param {JSONObject} payload
   */
  completeJob(jobKey, payload) {
    return this.jobClient.completeJob(jobKey, payload);
  }

  /**
   * Fails a job by given jobKey.
   * @param {string} jobKey
   */
  failJob(jobKey) {
    return this.jobClient.failJob(jobKey);
  }
}

module.exports = Client;