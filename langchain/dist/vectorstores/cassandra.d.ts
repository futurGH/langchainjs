import { DseClientOptions } from "cassandra-driver";
import { AsyncCaller, AsyncCallerParams } from "../util/async_caller.js";
import { Embeddings } from "../embeddings/base.js";
import { VectorStore } from "./base.js";
import { Document } from "../document.js";
export interface Column {
    type: string;
    name: string;
}
export interface Index {
    name: string;
    value: string;
}
export interface CassandraLibArgs extends DseClientOptions, AsyncCallerParams {
    table: string;
    keyspace: string;
    dimensions: number;
    primaryKey: Column;
    metadataColumns: Column[];
    indices?: Index[];
    batchSize?: number;
}
/**
 * Class for interacting with the Cassandra database. It extends the
 * VectorStore class and provides methods for adding vectors and
 * documents, searching for similar vectors, and creating instances from
 * texts or documents.
 */
export declare class CassandraStore extends VectorStore {
    FilterType: Record<string, any>;
    private client;
    private readonly dimensions;
    private readonly keyspace;
    private primaryKey;
    private metadataColumns;
    private readonly table;
    private indices;
    private isInitialized;
    asyncCaller: AsyncCaller;
    private readonly batchSize;
    _vectorstoreType(): string;
    constructor(embeddings: Embeddings, args: CassandraLibArgs);
    /**
     * Method to save vectors to the Cassandra database.
     * @param vectors Vectors to save.
     * @param documents The documents associated with the vectors.
     * @returns Promise that resolves when the vectors have been added.
     */
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
    /**
     * Method to add documents to the Cassandra database.
     * @param documents The documents to add.
     * @returns Promise that resolves when the documents have been added.
     */
    addDocuments(documents: Document[]): Promise<void>;
    /**
     * Method to search for vectors that are similar to a given query vector.
     * @param query The query vector.
     * @param k The number of similar vectors to return.
     * @param filter
     * @returns Promise that resolves with an array of tuples, each containing a Document and a score.
     */
    similaritySearchVectorWithScore(query: number[], k: number, filter?: this["FilterType"]): Promise<[Document, number][]>;
    /**
     * Static method to create an instance of CassandraStore from texts.
     * @param texts The texts to use.
     * @param metadatas The metadata associated with the texts.
     * @param embeddings The embeddings to use.
     * @param args The arguments for the CassandraStore.
     * @returns Promise that resolves with a new instance of CassandraStore.
     */
    static fromTexts(texts: string[], metadatas: object | object[], embeddings: Embeddings, args: CassandraLibArgs): Promise<CassandraStore>;
    /**
     * Static method to create an instance of CassandraStore from documents.
     * @param docs The documents to use.
     * @param embeddings The embeddings to use.
     * @param args The arguments for the CassandraStore.
     * @returns Promise that resolves with a new instance of CassandraStore.
     */
    static fromDocuments(docs: Document[], embeddings: Embeddings, args: CassandraLibArgs): Promise<CassandraStore>;
    /**
     * Static method to create an instance of CassandraStore from an existing
     * index.
     * @param embeddings The embeddings to use.
     * @param args The arguments for the CassandraStore.
     * @returns Promise that resolves with a new instance of CassandraStore.
     */
    static fromExistingIndex(embeddings: Embeddings, args: CassandraLibArgs): Promise<CassandraStore>;
    /**
     * Method to initialize the Cassandra database.
     * @returns Promise that resolves when the database has been initialized.
     */
    private initialize;
    private buildWhereClause;
    /**
     * Method to build an CQL query for searching for similar vectors in the
     * Cassandra database.
     * @param query The query vector.
     * @param k The number of similar vectors to return.
     * @param filter
     * @returns The CQL query string.
     */
    private buildSearchQuery;
    /**
     * Method for inserting vectors and documents into the Cassandra database in a batch.
     * @param batchVectors The list of vectors to insert.
     * @param batchDocuments The list of documents to insert.
     * @returns Promise that resolves when the batch has been inserted.
     */
    private executeInsert;
    /**
     * Method for inserting vectors and documents into the Cassandra database in
     * parallel, keeping within maxConcurrency number of active insert statements.
     * @param vectors The vectors to insert.
     * @param documents The documents to insert.
     * @returns Promise that resolves when the documents have been added.
     */
    private insertAll;
}
