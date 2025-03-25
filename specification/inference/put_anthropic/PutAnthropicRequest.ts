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

import {
  InferenceChunkingSettings,
  RateLimitSetting
} from '@inference/_types/Services'
import { RequestBase } from '@_types/Base'
import { Id } from '@_types/common'
import { float, integer } from '@_types/Numeric'

/**
 * Create an Anthropic inference endpoint.
 *
 * Create an inference endpoint to perform an inference task with the `anthropic` service.
 *
 * When you create an inference endpoint, the associated machine learning model is automatically deployed if it is not already running.
 * After creating the endpoint, wait for the model deployment to complete before using it.
 * To verify the deployment status, use the get trained model statistics API.
 * Look for `"state": "fully_allocated"` in the response and ensure that the `"allocation_count"` matches the `"target_allocation_count"`.
 * Avoid creating multiple endpoints for the same model unless required, as each endpoint consumes significant resources.
 * @rest_spec_name inference.put_anthropic
 * @availability stack since=8.16.0 stability=stable visibility=public
 * @availability serverless stability=stable visibility=public
 * @cluster_privileges manage_inference
 * @doc_id inference-api-put-anthropic
 */
export interface Request extends RequestBase {
  urls: [
    {
      path: '/_inference/{task_type}/{anthropic_inference_id}'
      methods: ['PUT']
    }
  ]
  path_parts: {
    /**
     * The task type.
     * The only valid task type for the model to perform is `completion`.
     */
    task_type: AnthropicTaskType
    /**
     * The unique identifier of the inference endpoint.
     */
    anthropic_inference_id: Id
  }
  body: {
    /**
     * The chunking configuration object.
     * @ext_doc_id inference-chunking
     */
    chunking_settings?: InferenceChunkingSettings
    /**
     * The type of service supported for the specified task type. In this case, `anthropic`.
     */
    service: ServiceType
    /**
     * Settings used to install the inference model. These settings are specific to the `watsonxai` service.
     */
    service_settings: AnthropicServiceSettings
    /**
     * Settings to configure the inference task.
     * These settings are specific to the task type you specified.
     */
    task_settings?: AnthropicTaskSettings
  }
}

export enum AnthropicTaskType {
  completion
}

export enum ServiceType {
  anthropic
}

export class AnthropicServiceSettings {
  /**
   * A valid API key for the Anthropic API.
   */
  api_key: string
  /**
   * The name of the model to use for the inference task.
   * Refer to the Anthropic documentation for the list of supported models.
   * @ext_doc_id anothropic-models
   */
  model_id: string
  /**
   * This setting helps to minimize the number of rate limit errors returned from Anthropic.
   * By default, the `anthropic` service sets the number of requests allowed per minute to 50.
   */
  rate_limit?: RateLimitSetting
}

export class AnthropicTaskSettings {
  /**
   * For a `completion` task, it is the maximum number of tokens to generate before stopping.
   */
  max_tokens: integer
  /**
   * For a `completion` task, it is the amount of randomness injected into the response.
   * For more details about the supported range, refer to Anthropic documentation.
   * @ext_doc_id anthropic-messages
   */
  temperature?: float
  /**
   * For a `completion` task, it specifies to only sample from the top K options for each subsequent token.
   * It is recommended for advanced use cases only.
   * You usually only need to use `temperature`.
   */
  top_k?: integer
  /**
   * For a `completion` task, it specifies to use Anthropic's nucleus sampling.
   * In nucleus sampling, Anthropic computes the cumulative distribution over all the options for each subsequent token in decreasing probability order and cuts it off once it reaches the specified probability.
   * You should either alter `temperature` or `top_p`, but not both.
   * It is recommended for advanced use cases only.
   * You usually only need to use `temperature`.
   */
  top_p?: float
}
