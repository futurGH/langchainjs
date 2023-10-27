import { BaseLanguageModel } from "../../../base_language/index.js";
import { Tool } from "../../../tools/base.js";
import { JsonSpec } from "../../../tools/json.js";
import { AgentExecutor } from "../../executor.js";
import { ZeroShotCreatePromptArgs } from "../../mrkl/index.js";
import { Toolkit } from "../base.js";
import { Headers } from "../../../tools/requests.js";
/**
 * Represents a toolkit for making HTTP requests. It initializes the
 * request tools based on the provided headers.
 */
export declare class RequestsToolkit extends Toolkit {
    tools: Tool[];
    constructor(headers?: Headers);
}
/**
 * Extends the `RequestsToolkit` class and adds a dynamic tool for
 * exploring JSON data. It creates a JSON agent using the `JsonToolkit`
 * and the provided language model, and adds the JSON explorer tool to the
 * toolkit.
 */
export declare class OpenApiToolkit extends RequestsToolkit {
    constructor(jsonSpec: JsonSpec, llm: BaseLanguageModel, headers?: Headers);
}
/**
 * Creates an OpenAPI agent using a language model, an OpenAPI toolkit,
 * and optional prompt arguments. It creates a prompt for the agent using
 * the OpenAPI tools and the provided prefix and suffix. It then creates a
 * ZeroShotAgent with the prompt and the OpenAPI tools, and returns an
 * AgentExecutor for executing the agent with the tools.
 * @param llm The language model to use.
 * @param openApiToolkit The OpenAPI toolkit to use.
 * @param args Optional arguments for creating the prompt.
 * @returns An AgentExecutor for executing the agent with the tools.
 *
 * @security **Security Notice** This agent provides access to external APIs.
 * Use with caution as this agent can make API calls with arbitrary headers.
 * Exposing this agent to users could lead to security vulnerabilities. Consider
 * limiting access to what endpoints it can hit, what actions can be taken, and
 * more.
 *
 * @link See https://js.langchain.com/docs/security for more information.
 */
export declare function createOpenApiAgent(llm: BaseLanguageModel, openApiToolkit: OpenApiToolkit, args?: ZeroShotCreatePromptArgs): AgentExecutor<import("../../../schema/index.js").ChainValues & {
    agent_scratchpad?: string | import("../../../schema/index.js").BaseMessage[] | undefined;
    stop?: string[] | undefined;
}, import("../../../schema/index.js").AgentAction | import("../../../schema/index.js").AgentFinish>;
