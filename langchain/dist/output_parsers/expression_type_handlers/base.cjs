"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTParser = exports.NodeHandler = void 0;
const peggy_grammar_js_1 = __importDefault(require("./peggy-grammar.cjs"));
/**
 * Abstract class for handling nodes in an expression language. Subclasses
 * must implement the `accepts` and `handle` methods.
 */
class NodeHandler {
    constructor(parentHandler) {
        Object.defineProperty(this, "parentHandler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parentHandler
        });
    }
}
exports.NodeHandler = NodeHandler;
/**
 * Utility class for parsing Abstract Syntax Trees (ASTs). Contains
 * methods for identifying the type of a given node and a method for
 * importing and generating a parser using the Peggy library.
 */
class ASTParser {
    /**
     * Imports and generates a parser using the Peggy library.
     * @returns A Promise that resolves to the parser instance.
     */
    static async importASTParser() {
        try {
            if (!ASTParser.astParseInstance) {
                const { parse } = peggy_grammar_js_1.default;
                ASTParser.astParseInstance = parse;
            }
            return ASTParser.astParseInstance;
        }
        catch (e) {
            throw new Error(`Failed to import peggy. Please install peggy (i.e. "npm install peggy" or "yarn add peggy").`);
        }
    }
    /**
     * Checks if the given node is a Program node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is a Program node.
     */
    static isProgram(node) {
        return node.type === "Program";
    }
    /**
     * Checks if the given node is an ExpressionStatement node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is an ExpressionStatement node.
     */
    static isExpressionStatement(node) {
        return node.type === "ExpressionStatement";
    }
    /**
     * Checks if the given node is a CallExpression node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is a CallExpression node.
     */
    static isCallExpression(node) {
        return node.type === "CallExpression";
    }
    /**
     * Checks if the given node is a StringLiteral node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is a StringLiteral node.
     */
    static isStringLiteral(node) {
        return node.type === "StringLiteral" && typeof node.value === "string";
    }
    /**
     * Checks if the given node is a NumericLiteral node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is a NumericLiteral node.
     */
    static isNumericLiteral(node) {
        return node.type === "NumericLiteral" && typeof node.value === "number";
    }
    /**
     * Checks if the given node is a BooleanLiteral node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is a BooleanLiteral node.
     */
    static isBooleanLiteral(node) {
        return node.type === "BooleanLiteral" && typeof node.value === "boolean";
    }
    /**
     * Checks if the given node is an Identifier node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is an Identifier node.
     */
    static isIdentifier(node) {
        return node.type === "Identifier";
    }
    /**
     * Checks if the given node is an ObjectExpression node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is an ObjectExpression node.
     */
    static isObjectExpression(node) {
        return node.type === "ObjectExpression";
    }
    /**
     * Checks if the given node is an ArrayExpression node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is an ArrayExpression node.
     */
    static isArrayExpression(node) {
        return node.type === "ArrayExpression";
    }
    /**
     * Checks if the given node is a PropertyAssignment node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is a PropertyAssignment node.
     */
    static isPropertyAssignment(node) {
        return node.type === "PropertyAssignment";
    }
    /**
     * Checks if the given node is a MemberExpression node.
     * @param node The node to be checked.
     * @returns A boolean indicating whether the node is a MemberExpression node.
     */
    static isMemberExpression(node) {
        return node.type === "MemberExpression";
    }
}
exports.ASTParser = ASTParser;
