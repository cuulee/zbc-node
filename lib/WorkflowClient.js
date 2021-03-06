// Copyright © 2018 Camunda Services GmbH (info@camunda.com)
//
// Licensed under the Apache License, Version 2.0 (the "License")
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

const {isUndefinedOrNull, typeMatchers} = require('./__internal/utils')
const {workflowClientErrors} = require('./__internal/errors')

class WorkflowClient {
  constructor (ffiLib) {
    this.zbc = ffiLib.zbc
    this.structs = ffiLib.structs
  }

  createWorkflow (topicName, fileName) {
    if (isUndefinedOrNull(topicName) || isUndefinedOrNull(fileName)) {
      console.error(workflowClientErrors.createWorkflow_TopicFileNull)
      return null
    }
    if (!typeMatchers.string(topicName) || !typeMatchers.string(fileName)) {
      console.error(workflowClientErrors.createWorkflow_TopicFileNoString)
      return null
    }

    const returnValue = this.zbc.CreateWorkflow(this.structs.newGoString(topicName), this.structs.newGoString(fileName))

    if (!isUndefinedOrNull(returnValue)) {
      return JSON.parse(returnValue)
    } else {
      console.error(workflowClientErrors.createWorkflow_NoZbcResponse)
      return null
    }
  }

  createWorkflowInstance (topicName, bpmnProcessId, version, payload) {
    if (isUndefinedOrNull(topicName) || isUndefinedOrNull(bpmnProcessId)) {
      console.error(workflowClientErrors.createWorkflowInstance_TopicProcessNull)
      return null
    }
    if (!typeMatchers.string(topicName) || !typeMatchers.string(bpmnProcessId)) {
      console.error(workflowClientErrors.createWorkflowInstance_TopicProcessNoString)
      return null
    }

    if (isUndefinedOrNull(version)) {
      // using latest version if not given
      version = -1
    }

    let payloadString
    if (isUndefinedOrNull(payload)) {
      payloadString = '{}'
    } else if (typeMatchers.string(payload)) {
      payloadString = payload
    } else {
      payloadString = JSON.stringify(payload)
    }

    const returnValue = this.zbc.CreateWorkflowInstance(this.structs.newGoString(topicName), this.structs.newGoString(bpmnProcessId), version, this.structs.newGoString(payloadString))
    if (!isUndefinedOrNull(returnValue)) {
      return JSON.parse(returnValue)
    } else {
      console.error(workflowClientErrors.createWorkflowInstance_NoZbcResponse)
      return null
    }
  }
}

module.exports = WorkflowClient
