/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AdaptiveAllocations } from '@inference/_types/CommonTypes'
import { InferenceChunkingSettings } from '@inference/_types/Services'
import { RequestBase } from '@_types/Base'
import { Id } from '@_types/common'
import { integer } from '@_types/Numeric'

/**
 * Create an Elasticsearch inference endpoint.
 *
 * Create an inference endpoint to perform an inference task with the `elasticsearch` service.
 *
 * > info
 * > Your Elasticsearch deployment contains preconfigured ELSER and E5 inference endpoints, you only need to create the enpoints using the API if you want to customize the settings.
 *
 * If you use the ELSER or the E5 model through the `elasticsearch` service, the API request will automatically download and deploy the model if it isn't downloaded yet.
 *
 * > info
 * > You might see a 502 bad gateway error in the response when using the Kibana Console. This error usually just reflects a timeout, while the model downloads in the background. You can check the download progress in the Machine Learning UI. If using the Python client, you can set the timeout parameter to a higher value.
 *
 * After creating the endpoint, wait for the model deployment to complete before using it.
 * To verify the deployment status, use the get trained model statistics API.
 * Look for `"state": "fully_allocated"` in the response and ensure that the `"allocation_count"` matches the `"target_allocation_count"`.
 * Avoid creating multiple endpoints for the same model unless required, as each endpoint consumes significant resources.
 * @rest_spec_name inference.put_elasticsearch
 * @availability stack since=8.13.0 stability=stable visibility=public
 * @availability serverless stability=stable visibility=public
 * @cluster_privileges manage_inference
 * @doc_id inference-api-put-elasticsearch
 */
export interface Request extends RequestBase {
  urls: [
    {
      path: '/_inference/{task_type}/{elasticsearch_inference_id}'
      methods: ['PUT']
    }
  ]
  path_parts: {
    /**
     * The type of the inference task that the model will perform.
     */
    task_type: ElasticsearchTaskType
    /**
     * The unique identifier of the inference endpoint.
     * The must not match the `model_id`.
     */
    elasticsearch_inference_id: Id
  }
  body: {
    /**
     * The chunking configuration object.
     * @ext_doc_id inference-chunking
     */
    chunking_settings?: InferenceChunkingSettings
    /**
     * The type of service supported for the specified task type. In this case, `elasticsearch`.
     */
    service: ServiceType
    /**
     * Settings used to install the inference model. These settings are specific to the `elasticsearch` service.
     */
    service_settings: ElasticsearchServiceSettings
    /**
     * Settings to configure the inference task.
     * These settings are specific to the task type you specified.
     */
    task_settings?: ElasticsearchTaskSettings
  }
}

export enum ElasticsearchTaskType {
  rerank,
  sparse_embedding,
  text_embedding
}

export enum ServiceType {
  elasticsearch
}

export class ElasticsearchServiceSettings {
  /**
   * Adaptive allocations configuration details.
   * If `enabled` is true, the number of allocations of the model is set based on the current load the process gets.
   * When the load is high, a new model allocation is automatically created, respecting the value of `max_number_of_allocations` if it's set.
   * When the load is low, a model allocation is automatically removed, respecting the value of `min_number_of_allocations` if it's set.
   * If `enabled` is true, do not set the number of allocations manually.
   */
  adaptive_allocations?: AdaptiveAllocations
  /**
   * The deployment identifier for a trained model deployment.
   * When `deployment_id` is used the `model_id` is optional.
   */
  deployment_id?: string
  /**
   * The name of the model to use for the inference task.
   * It can be the ID of a built-in model (for example, `.multilingual-e5-small` for E5) or a text embedding model that was uploaded by using the Eland client.
   * @ext_doc_id eland-import
   */
  model_id: string
  /**
   * The total number of allocations that are assigned to the model across machine learning nodes.
   * Increasing this value generally increases the throughput.
   * If adaptive allocations are enabled, do not set this value because it's automatically set.
   */
  num_allocations?: integer
  /**
   * The number of threads used by each model allocation during inference.
   * This setting generally increases the speed per inference request.
   * The inference process is a compute-bound process; `threads_per_allocations` must not exceed the number of available allocated processors per node.
   * The value must be a power of 2.
   * The maximum value is 32.
   */
  num_threads: integer
}

export class ElasticsearchTaskSettings {
  /**
   * For a `rerank` task, return the document instead of only the index.
   * @server_default true
   */
  return_documents?: boolean
}
