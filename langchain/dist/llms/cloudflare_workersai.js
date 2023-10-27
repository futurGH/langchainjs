import { LLM } from "./base.js";
import { getEnvironmentVariable } from "../util/env.js";
/**
 * Class representing the CloudflareWorkersAI language model. It extends the LLM (Large
 * Language Model) class, providing a standard interface for interacting
 * with the CloudflareWorkersAI language model.
 */
export class CloudflareWorkersAI extends LLM {
    static lc_name() {
        return "CloudflareWorkersAI";
    }
    constructor(fields) {
        super(fields ?? {});
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "@cf/meta/llama-2-7b-chat-int8"
        });
        Object.defineProperty(this, "cloudflareAccountId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cloudflareApiToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.model = fields?.model ?? this.model;
        this.cloudflareAccountId =
            fields?.cloudflareAccountId ??
                getEnvironmentVariable("CLOUDFLARE_ACCOUNT_ID");
        this.cloudflareApiToken =
            fields?.cloudflareApiToken ??
                getEnvironmentVariable("CLOUDFLARE_API_TOKEN");
        this.baseUrl =
            fields?.baseUrl ??
                `https://api.cloudflare.com/client/v4/accounts/${this.cloudflareAccountId}/ai/run`;
        if (this.baseUrl.endsWith("/")) {
            this.baseUrl = this.baseUrl.slice(0, -1);
        }
    }
    /**
     * Method to validate the environment.
     */
    validateEnvironment() {
        if (this.baseUrl === undefined) {
            if (!this.cloudflareAccountId) {
                throw new Error(`No Cloudflare account ID found. Please provide it when instantiating the CloudflareWorkersAI class, or set it as "CLOUDFLARE_ACCOUNT_ID" in your environment variables.`);
            }
            if (!this.cloudflareApiToken) {
                throw new Error(`No Cloudflare API key found. Please provide it when instantiating the CloudflareWorkersAI class, or set it as "CLOUDFLARE_API_KEY" in your environment variables.`);
            }
        }
    }
    /** Get the identifying parameters for this LLM. */
    get identifyingParams() {
        return { model: this.model };
    }
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams() {
        return {
            model: this.model,
        };
    }
    /** Get the type of LLM. */
    _llmType() {
        return "cloudflare";
    }
    /** Call out to CloudflareWorkersAI's complete endpoint.
     Args:
         prompt: The prompt to pass into the model.
         Returns:
     The string generated by the model.
     Example:
     let response = CloudflareWorkersAI.call("Tell me a joke.");
     */
    async _call(prompt, options) {
        this.validateEnvironment();
        const url = `${this.baseUrl}/${this.model}`;
        const headers = {
            Authorization: `Bearer ${this.cloudflareApiToken}`,
            "Content-Type": "application/json",
        };
        const data = { prompt };
        const responseData = await this.caller.call(async () => {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
                signal: options.signal,
            });
            if (!response.ok) {
                const error = new Error(`Cloudflare LLM call failed with status code ${response.status}`);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                error.response = response;
                throw error;
            }
            return response.json();
        });
        return responseData.result.response;
    }
}
