import { BaseChain, ChainInputs } from "../chains/base.js";
import { BaseMultiActionAgent, BaseSingleActionAgent } from "./agent.js";
import { StoppingMethod } from "./types.js";
import { SerializedLLMChain } from "../chains/serde.js";
import { AgentAction, AgentFinish, BaseMessage, ChainValues } from "../schema/index.js";
import { CallbackManagerForChainRun } from "../callbacks/manager.js";
import { OutputParserException } from "../schema/output_parser.js";
import { StructuredTool, Tool, ToolInputParsingException } from "../tools/base.js";
import { Runnable } from "../schema/runnable/base.js";
type ExtractToolType<T> = T extends {
    ToolType: infer Tool;
} ? Tool : StructuredTool;
/**
 * Interface defining the structure of input data for creating an
 * AgentExecutor. It extends ChainInputs and includes additional
 * properties specific to agent execution.
 */
export interface AgentExecutorInput<RunInput extends ChainValues & {
    agent_scratchpad?: string | BaseMessage[];
    stop?: string[];
} = any, RunOutput extends AgentAction | AgentFinish = any> extends ChainInputs {
    agent: BaseSingleActionAgent | BaseMultiActionAgent | Runnable<RunInput, RunOutput>;
    tools: ExtractToolType<this["agent"]>[];
    returnIntermediateSteps?: boolean;
    maxIterations?: number;
    earlyStoppingMethod?: StoppingMethod;
    handleParsingErrors?: boolean | string | ((e: OutputParserException | ToolInputParsingException) => string);
}
/**
 * Tool that just returns the query.
 * Used for exception tracking.
 */
export declare class ExceptionTool extends Tool {
    name: string;
    description: string;
    _call(query: string): Promise<string>;
}
/**
 * A chain managing an agent using tools.
 * @augments BaseChain
 */
export declare class AgentExecutor<RunInput extends ChainValues & {
    agent_scratchpad?: string | BaseMessage[];
    stop?: string[];
} = any, RunOutput extends AgentAction | AgentFinish = any> extends BaseChain {
    static lc_name(): string;
    get lc_namespace(): string[];
    agent: BaseSingleActionAgent | BaseMultiActionAgent;
    tools: this["agent"]["ToolType"][];
    returnIntermediateSteps: boolean;
    maxIterations?: number;
    earlyStoppingMethod: StoppingMethod;
    /**
     * How to handle errors raised by the agent's output parser.
      Defaults to `False`, which raises the error.
  
      If `true`, the error will be sent back to the LLM as an observation.
      If a string, the string itself will be sent to the LLM as an observation.
      If a callable function, the function will be called with the exception
      as an argument, and the result of that function will be passed to the agent
      as an observation.
     */
    handleParsingErrors: boolean | string | ((e: OutputParserException | ToolInputParsingException) => string);
    get inputKeys(): string[];
    get outputKeys(): string[];
    constructor(input: AgentExecutorInput<RunInput, RunOutput>);
    /** Create from agent and a list of tools. */
    static fromAgentAndTools<RunInput extends ChainValues & {
        agent_scratchpad?: string | BaseMessage[];
        stop?: string[];
    }, RunOutput extends AgentAction | AgentFinish>(fields: AgentExecutorInput<RunInput, RunOutput>): AgentExecutor<RunInput, RunOutput>;
    /**
     * Method that checks if the agent execution should continue based on the
     * number of iterations.
     * @param iterations The current number of iterations.
     * @returns A boolean indicating whether the agent execution should continue.
     */
    private shouldContinue;
    /** @ignore */
    _call(inputs: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    _chainType(): "agent_executor";
    serialize(): SerializedLLMChain;
}
export {};
