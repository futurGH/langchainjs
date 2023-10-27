"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGoogleVertexAI = void 0;
const base_js_1 = require("../base.cjs");
/**
 * Base class for Google Vertex AI LLMs.
 * Implemented subclasses must provide a GoogleVertexAILLMConnection
 * with an appropriate auth client.
 */
class BaseGoogleVertexAI extends base_js_1.BaseLLM {
    get lc_aliases() {
        return {
            model: "model_name",
        };
    }
    constructor(fields) {
        super(fields ?? {});
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "text-bison"
        });
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.7
        });
        Object.defineProperty(this, "maxOutputTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1024
        });
        Object.defineProperty(this, "topP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.8
        });
        Object.defineProperty(this, "topK", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 40
        });
        Object.defineProperty(this, "connection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = fields?.model ?? this.model;
        // Change the defaults for code models
        if (this.model.startsWith("code-gecko")) {
            this.maxOutputTokens = 64;
        }
        if (this.model.startsWith("code-")) {
            this.temperature = 0.2;
        }
        this.temperature = fields?.temperature ?? this.temperature;
        this.maxOutputTokens = fields?.maxOutputTokens ?? this.maxOutputTokens;
        this.topP = fields?.topP ?? this.topP;
        this.topK = fields?.topK ?? this.topK;
    }
    _llmType() {
        return "vertexai";
    }
    async _generate(prompts, options) {
        const generations = await Promise.all(prompts.map((prompt) => this._generatePrompt(prompt, options)));
        return { generations };
    }
    async _generatePrompt(prompt, options) {
        const instance = this.formatInstance(prompt);
        const parameters = {
            temperature: this.temperature,
            topK: this.topK,
            topP: this.topP,
            maxOutputTokens: this.maxOutputTokens,
        };
        const result = await this.connection.request([instance], parameters, options);
        const prediction = this.extractPredictionFromResponse(result);
        return [
            {
                text: prediction.content,
                generationInfo: prediction,
            },
        ];
    }
    /**
     * Formats the input instance as a text instance for the Google Vertex AI
     * model.
     * @param prompt Prompt to be formatted as a text instance.
     * @returns A GoogleVertexAILLMInstance object representing the formatted text instance.
     */
    formatInstanceText(prompt) {
        return { content: prompt };
    }
    /**
     * Formats the input instance as a code instance for the Google Vertex AI
     * model.
     * @param prompt Prompt to be formatted as a code instance.
     * @returns A GoogleVertexAILLMInstance object representing the formatted code instance.
     */
    formatInstanceCode(prompt) {
        return { prefix: prompt };
    }
    /**
     * Formats the input instance for the Google Vertex AI model based on the
     * model type (text or code).
     * @param prompt Prompt to be formatted as an instance.
     * @returns A GoogleVertexAILLMInstance object representing the formatted instance.
     */
    formatInstance(prompt) {
        return this.model.startsWith("code-")
            ? this.formatInstanceCode(prompt)
            : this.formatInstanceText(prompt);
    }
    /**
     * Extracts the prediction from the API response.
     * @param result The API response from which to extract the prediction.
     * @returns A TextPrediction object representing the extracted prediction.
     */
    extractPredictionFromResponse(result) {
        return result?.data?.predictions[0];
    }
}
exports.BaseGoogleVertexAI = BaseGoogleVertexAI;
