interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  attendees: number;
  days: string[];
  mealPreference: string;
  drinks: string[];
  specialRequirements: string;
  created_at: string;
}

interface Database {
  users: any[];
  registrations: Registration[];
}

class DatabaseService {
  private readonly STORAGE_KEY = 'farmaris_database';

  private getDatabase(): Database {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing database:', error);
      }
    }
    
    // Return default database
    return {
      users: [
        {
          id: "admin-001",
          email: "admin@farmaris.com",
          role: "admin",
          fullName: "Farm Aris Admin",
          created_at: new Date().toISOString()
        }
      ],
      registrations: []
    };
  }

  private saveDatabase(database: Database): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(database));
  }

  public addRegistration(registrationData: Omit<Registration, 'id' | 'created_at'>): Registration {
    const database = this.getDatabase();
    
    const newRegistration: Registration = {
      ...registrationData,
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };

    database.registrations.push(newRegistration);
    this.saveDatabase(database);
    
    return newRegistration;
  }

  public getAllRegistrations(): Registration[] {
    const database = this.getDatabase();
    return database.registrations.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public getRegistrationStats() {
    const registrations = this.getAllRegistrations();
    
    const stats = {
      totalRegistrations: registrations.length,
      totalAttendees: registrations.reduce((sum, reg) => sum + reg.attendees, 0),
      fridayAttendees: registrations.filter(reg => reg.days.includes('friday')).length,
      saturdayAttendees: registrations.filter(reg => reg.days.includes('saturday')).length,
      campingAttendees: registrations.filter(reg => reg.days.includes('camping')).length,
      mealPreferences: {} as Record<string, number>,
      drinkPreferences: {} as Record<string, number>
    };

    // Count meal preferences
    registrations.forEach(reg => {
      if (reg.mealPreference) {
        stats.mealPreferences[reg.mealPreference] = (stats.mealPreferences[reg.mealPreference] || 0) + 1;
      }
    });

    // Count drink preferences
    registrations.forEach(reg => {
      reg.drinks.forEach(drink => {
        stats.drinkPreferences[drink] = (stats.drinkPreferences[drink] || 0) + 1;
      });
    });

    return stats;
  }

  public exportRegistrations(): string {
    const registrations = this.getAllRegistrations();
    
    const csvHeader = 'Name,Email,Phone,Attendees,Days,Meal Preference,Drinks,Special Requirements,Registration Date\n';
    const csvRows = registrations.map(reg => 
      `"${reg.fullName}","${reg.email}","${reg.phone}",${reg.attendees},"${reg.days.join(', ')}","${reg.mealPreference}","${reg.drinks.join(', ')}","${reg.specialRequirements}","${new Date(reg.created_at).toLocaleDateString()}"`
    ).join('\n');
    
    return csvHeader + csvRows;
  }
}

export const databaseService = new DatabaseService();
export type { Registration };