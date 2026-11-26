import { ProblemRecord, KnowledgeArticle, User } from '../types';
import { INITIAL_PROBLEM_RECORDS, INITIAL_KNOWLEDGE_ARTICLES, DEMO_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  HISTORY: 'fixtrail_history_records_v1',
  KNOWLEDGE: 'fixtrail_knowledge_articles_v1',
  CURRENT_USER: 'fixtrail_current_user_v1',
  CUSTOM_API_KEY: 'fixtrail_custom_api_key_v1',
  THEME: 'fixtrail_theme_preference_v1',
};

export const storageService = {
  getHistory(): ProblemRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_PROBLEM_RECORDS));
        return INITIAL_PROBLEM_RECORDS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROBLEM_RECORDS;
    }
  },

  saveHistory(records: ProblemRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  },

  addProblemRecord(record: ProblemRecord): ProblemRecord[] {
    const list = this.getHistory();
    const updated = [record, ...list];
    this.saveHistory(updated);
    return updated;
  },

  updateRecordStatus(recordId: string, status: ProblemRecord['status'], notes?: string): ProblemRecord[] {
    const list = this.getHistory();
    const updated = list.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status,
          userNotes: notes !== undefined ? notes : rec.userNotes,
          resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
        };
      }
      return rec;
    });
    this.saveHistory(updated);
    return updated;
  },

  deleteRecord(recordId: string): ProblemRecord[] {
    const list = this.getHistory();
    const updated = list.filter(r => r.id !== recordId);
    this.saveHistory(updated);
    return updated;
  },

  getKnowledgeBase(): KnowledgeArticle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(INITIAL_KNOWLEDGE_ARTICLES));
        return INITIAL_KNOWLEDGE_ARTICLES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_KNOWLEDGE_ARTICLES;
    }
  },

  saveKnowledgeBase(articles: KnowledgeArticle[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save knowledge base to localStorage', e);
    }
  },

  upvoteArticle(articleId: string): KnowledgeArticle[] {
    const list = this.getKnowledgeBase();
    const updated = list.map(a => a.id === articleId ? { ...a, upvotes: a.upvotes + 1 } : a);
    this.saveKnowledgeBase(updated);
    return updated;
  },

  addArticle(article: KnowledgeArticle): KnowledgeArticle[] {
    const list = this.getKnowledgeBase();
    const updated = [article, ...list];
    this.saveKnowledgeBase(updated);
    return updated;
  },

  getCurrentUser(): User {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
        return DEMO_USERS[0];
      }
      return JSON.parse(data);
    } catch {
      return DEMO_USERS[0];
    }
  },

  setCurrentUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },

  getApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_API_KEY) || '';
  },

  setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_API_KEY, key);
  }
};
