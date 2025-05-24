import { 
  boards, 
  lists, 
  cards,
  type Board, 
  type List, 
  type Card,
  type InsertBoard,
  type InsertList,
  type InsertCard,
  type UpdateCard
} from "@shared/schema";

export interface IStorage {
  // Board operations
  getBoards(): Promise<Board[]>;
  getBoard(id: number): Promise<Board | undefined>;
  createBoard(board: InsertBoard): Promise<Board>;
  updateBoard(id: number, board: Partial<InsertBoard>): Promise<Board | undefined>;
  deleteBoard(id: number): Promise<boolean>;

  // List operations
  getLists(boardId: number): Promise<List[]>;
  getList(id: number): Promise<List | undefined>;
  createList(list: InsertList): Promise<List>;
  updateList(id: number, list: Partial<InsertList>): Promise<List | undefined>;
  deleteList(id: number): Promise<boolean>;

  // Card operations
  getCards(listId: number): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: number, card: UpdateCard): Promise<Card | undefined>;
  deleteCard(id: number): Promise<boolean>;
  moveCard(cardId: number, targetListId: number, targetPosition: number): Promise<Card | undefined>;
}

export class MemStorage implements IStorage {
  private boards: Map<number, Board>;
  private lists: Map<number, List>;
  private cards: Map<number, Card>;
  private currentBoardId: number;
  private currentListId: number;
  private currentCardId: number;

  constructor() {
    this.boards = new Map();
    this.lists = new Map();
    this.cards = new Map();
    this.currentBoardId = 1;
    this.currentListId = 1;
    this.currentCardId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample board
    const sampleBoard: Board = {
      id: this.currentBoardId++,
      title: "Rozwój Aplikacji Web",
      description: "Główna tablica projektowa dla zespołu frontend"
    };
    this.boards.set(sampleBoard.id, sampleBoard);

    // Create sample lists
    const sampleLists: List[] = [
      { id: this.currentListId++, title: "Do zrobienia", boardId: sampleBoard.id, position: 0 },
      { id: this.currentListId++, title: "W trakcie", boardId: sampleBoard.id, position: 1 },
      { id: this.currentListId++, title: "Do sprawdzenia", boardId: sampleBoard.id, position: 2 },
      { id: this.currentListId++, title: "Ukończone", boardId: sampleBoard.id, position: 3 }
    ];

    sampleLists.forEach(list => this.lists.set(list.id, list));

    // Create sample cards
    const sampleCards: Card[] = [
      {
        id: this.currentCardId++,
        title: "Projekt interfejsu logowania",
        description: "Zaprojektować nowoczesny interfejs formularza logowania z walidacją",
        listId: sampleLists[0].id,
        position: 0,
        labels: ["Frontend", "Wysoki"],
        dueDate: "2024-12-15"
      },
      {
        id: this.currentCardId++,
        title: "Implementacja API dla użytkowników",
        description: "Utworzenie endpointów dla rejestracji, logowania i zarządzania profilami",
        listId: sampleLists[0].id,
        position: 1,
        labels: ["Backend", "Krytyczny"],
        dueDate: "2024-12-18"
      },
      {
        id: this.currentCardId++,
        title: "Testowanie responsywności",
        description: null,
        listId: sampleLists[0].id,
        position: 2,
        labels: ["QA"],
        dueDate: null
      },
      {
        id: this.currentCardId++,
        title: "Integracja systemu płatności",
        description: "Implementacja Stripe dla obsługi płatności online",
        listId: sampleLists[1].id,
        position: 0,
        labels: ["Backend", "Wysoki"],
        dueDate: null
      },
      {
        id: this.currentCardId++,
        title: "Dashboard analityczny",
        description: "Tworzenie dashboardu z wykresami i statystykami",
        listId: sampleLists[1].id,
        position: 1,
        labels: ["Frontend"],
        dueDate: "2024-12-22"
      }
    ];

    sampleCards.forEach(card => this.cards.set(card.id, card));
  }

  // Board operations
  async getBoards(): Promise<Board[]> {
    return Array.from(this.boards.values());
  }

  async getBoard(id: number): Promise<Board | undefined> {
    return this.boards.get(id);
  }

  async createBoard(insertBoard: InsertBoard): Promise<Board> {
    const board: Board = { ...insertBoard, id: this.currentBoardId++ };
    this.boards.set(board.id, board);
    return board;
  }

  async updateBoard(id: number, board: Partial<InsertBoard>): Promise<Board | undefined> {
    const existingBoard = this.boards.get(id);
    if (!existingBoard) return undefined;

    const updatedBoard = { ...existingBoard, ...board };
    this.boards.set(id, updatedBoard);
    return updatedBoard;
  }

  async deleteBoard(id: number): Promise<boolean> {
    // Delete all lists and cards associated with this board
    const boardLists = Array.from(this.lists.values()).filter(list => list.boardId === id);
    for (const list of boardLists) {
      await this.deleteList(list.id);
    }
    
    return this.boards.delete(id);
  }

  // List operations
  async getLists(boardId: number): Promise<List[]> {
    return Array.from(this.lists.values())
      .filter(list => list.boardId === boardId)
      .sort((a, b) => a.position - b.position);
  }

  async getList(id: number): Promise<List | undefined> {
    return this.lists.get(id);
  }

  async createList(insertList: InsertList): Promise<List> {
    const existingLists = await this.getLists(insertList.boardId);
    const position = existingLists.length;
    
    const list: List = { ...insertList, id: this.currentListId++, position };
    this.lists.set(list.id, list);
    return list;
  }

  async updateList(id: number, list: Partial<InsertList>): Promise<List | undefined> {
    const existingList = this.lists.get(id);
    if (!existingList) return undefined;

    const updatedList = { ...existingList, ...list };
    this.lists.set(id, updatedList);
    return updatedList;
  }

  async deleteList(id: number): Promise<boolean> {
    // Delete all cards in this list
    const listCards = Array.from(this.cards.values()).filter(card => card.listId === id);
    for (const card of listCards) {
      this.cards.delete(card.id);
    }
    
    return this.lists.delete(id);
  }

  // Card operations
  async getCards(listId: number): Promise<Card[]> {
    return Array.from(this.cards.values())
      .filter(card => card.listId === listId)
      .sort((a, b) => a.position - b.position);
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const existingCards = await this.getCards(insertCard.listId);
    const position = existingCards.length;
    
    const card: Card = { ...insertCard, id: this.currentCardId++, position };
    this.cards.set(card.id, card);
    return card;
  }

  async updateCard(id: number, card: UpdateCard): Promise<Card | undefined> {
    const existingCard = this.cards.get(id);
    if (!existingCard) return undefined;

    const updatedCard = { ...existingCard, ...card };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async deleteCard(id: number): Promise<boolean> {
    return this.cards.delete(id);
  }

  async moveCard(cardId: number, targetListId: number, targetPosition: number): Promise<Card | undefined> {
    const card = this.cards.get(cardId);
    if (!card) return undefined;

    // Update card's list and position
    const updatedCard = { ...card, listId: targetListId, position: targetPosition };
    this.cards.set(cardId, updatedCard);

    // Reorder other cards in the target list
    const targetListCards = Array.from(this.cards.values())
      .filter(c => c.listId === targetListId && c.id !== cardId)
      .sort((a, b) => a.position - b.position);

    targetListCards.forEach((c, index) => {
      const newPosition = index >= targetPosition ? index + 1 : index;
      if (c.position !== newPosition) {
        this.cards.set(c.id, { ...c, position: newPosition });
      }
    });

    return updatedCard;
  }
}

export const storage = new MemStorage();
