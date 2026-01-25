import { User, InsertUser, Log, Conversation, Message, UserRole } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

interface DataSchema {
  users: User[];
  logs: Log[];
  conversations: Conversation[];
  messages: Message[];
}

export interface IStorage {
  // User
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: User): Promise<User>;
  
  // Logs
  createLog(log: Log): Promise<Log>;
  getLogs(userId?: string): Promise<Log[]>;

  // Chat
  getAllConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: Conversation): Promise<Conversation>;
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: Message): Promise<Message>;
}

export class JsonStorage implements IStorage {
  private data: DataSchema;
  private initialized: Promise<void>;

  constructor() {
    this.data = { users: [], logs: [], conversations: [], messages: [] };
    this.initialized = this.init();
  }

  private async init() {
    try {
      const content = await fs.readFile(DATA_FILE, 'utf-8');
      this.data = JSON.parse(content);
    } catch (e) {
      // File doesn't exist or invalid, start fresh
      await this.persist();
    }
  }

  private async persist() {
    await fs.writeFile(DATA_FILE, JSON.stringify(this.data, null, 2));
  }

  async getUser(id: string): Promise<User | undefined> {
    await this.initialized;
    return this.data.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.initialized;
    return this.data.users.find(u => u.username === username);
  }

  async createUser(user: User): Promise<User> {
    await this.initialized;
    this.data.users.push(user);
    await this.persist();
    return user;
  }

  async createLog(log: Log): Promise<Log> {
    await this.initialized;
    this.data.logs.push(log);
    await this.persist();
    return log;
  }

  async getLogs(userId?: string): Promise<Log[]> {
    await this.initialized;
    if (userId) {
      return this.data.logs.filter(l => l.userId === userId);
    }
    return this.data.logs;
  }

  async getAllConversations(): Promise<Conversation[]> {
    await this.initialized;
    return this.data.conversations;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    await this.initialized;
    return this.data.conversations.find(c => c.id === id);
  }

  async createConversation(conversation: Conversation): Promise<Conversation> {
    await this.initialized;
    this.data.conversations.push(conversation);
    await this.persist();
    return conversation;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    await this.initialized;
    return this.data.messages.filter(m => m.conversationId === conversationId);
  }

  async createMessage(message: Message): Promise<Message> {
    await this.initialized;
    this.data.messages.push(message);
    await this.persist();
    return message;
  }
}

export const storage = new JsonStorage();
