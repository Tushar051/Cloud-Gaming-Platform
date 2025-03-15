import { users, type User, type InsertUser, games, type Game, type InsertGame } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  getGamesByCategory(category: string): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  searchGames(query: string): Promise<Game[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  userCurrentId: number;
  gameCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.userCurrentId = 1;
    this.gameCurrentId = 1;
    
    // Initialize with some sample games
    this.initializeGames();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.category.toLowerCase() === category.toLowerCase()
    );
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameCurrentId++;
    // Ensure gameUrl is never undefined, only string or null
    const gameUrl = insertGame.gameUrl === undefined ? null : insertGame.gameUrl;
    const game: Game = { ...insertGame, id, gameUrl };
    this.games.set(id, game);
    return game;
  }

  async searchGames(query: string): Promise<Game[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.games.values()).filter(
      (game) => 
        game.title.toLowerCase().includes(lowerQuery) || 
        game.description.toLowerCase().includes(lowerQuery)
    );
  }

  private initializeGames() {
    const sampleGames: InsertGame[] = [
      {
        title: "Subway Runner",
        description: "Run through a city landscape, dodge obstacles, collect coins and power-ups in this endless runner game!",
        category: "Arcade",
        rating: "4.8",
        imageUrl: "https://images.unsplash.com/photo-1533279443086-d1c19a186416?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/subway-runner"
      },
      {
        title: "Pixel Racer",
        description: "Drive at high speeds, drift around corners and unlock new cars in this fun racing game!",
        category: "Racing",
        rating: "4.7",
        imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/pixel-racer"
      },
      {
        title: "Maze Muncher",
        description: "Navigate through a maze eating dots while avoiding ghosts in this classic arcade-style game!",
        category: "Arcade",
        rating: "4.9",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/maze-muncher"
      },
      {
        title: "Tetris Challenge",
        description: "Rotate and place falling blocks to create complete lines and score points in this timeless puzzle game!",
        category: "Puzzle",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/tetris"
      },
      {
        title: "Space Invaders",
        description: "Defend Earth from alien invaders in this retro arcade shooter! Test your reflexes and accuracy.",
        category: "Arcade",
        rating: "4.8",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/space-invaders"
      },
      {
        title: "Snake Classic",
        description: "Control a growing snake, eat apples, and avoid crashing in this nostalgic game that never gets old!",
        category: "Arcade",
        rating: "4.7",
        imageUrl: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/snake"
      },
      {
        title: "Flappy Bird",
        description: "Navigate a bird through pipes by tapping to flap its wings. Simple but incredibly challenging!",
        category: "Arcade",
        rating: "4.9",
        imageUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/flappy-bird"
      },
      {
        title: "2048",
        description: "Merge tiles with the same numbers to reach the 2048 tile in this addictive mathematical puzzle!",
        category: "Puzzle",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80",
        gameUrl: "/games/2048"
      }
    ];

    sampleGames.forEach(game => {
      this.createGame(game);
    });
  }
}

export const storage = new MemStorage();
