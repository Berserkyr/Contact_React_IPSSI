import localforage from 'localforage';

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: 'my_appointments',
});

const APPOINTMENTS_KEY = 'appointments';
const CONTACTS_KEY = 'contacts';
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

const LocalForageService = {
  async getStoredAppointments() {
    try {
      let storedAppointments = await localforage.getItem(APPOINTMENTS_KEY);
      storedAppointments = storedAppointments || [];
      const uniqueAppointments = Array.from(new Map(storedAppointments.map(item => [item.id, item])).values());
      return uniqueAppointments;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous depuis LocalForage:', error);
      return [];
    }
  },

  async storeAppointments(appointments) {
    try {
      await localforage.setItem(APPOINTMENTS_KEY, appointments);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des rendez-vous dans LocalForage:', error);
    }
  },

  async addAppointment(newAppointment) {
    try {
      const appointments = await this.getStoredAppointments();
      const updatedAppointments = [...appointments, newAppointment];
      await this.storeAppointments(updatedAppointments);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rendez-vous et de la sauvegarde dans LocalForage:', error);
    }
  },

  async deleteAppointment(id) {
    try {
      let appointments = await this.getStoredAppointments();
      appointments = appointments.filter((appointment) => appointment.id !== id);
      await this.storeAppointments(appointments);
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous et de la sauvegarde dans LocalForage:', error);
    }
  },

  async updateAppointment(updatedAppointment) {
    try {
      let appointments = await this.getStoredAppointments();
      appointments = appointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      );
      await this.storeAppointments(appointments);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous et de la sauvegarde dans LocalForage:', error);
    }
  },

  async getStoredContacts() {
    try {
      let storedContacts = await localforage.getItem(CONTACTS_KEY);
      return storedContacts || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts depuis LocalForage:', error);
      return [];
    }
  },

  async storeContacts(contacts) {
    try {
      await localforage.setItem(CONTACTS_KEY, contacts);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des contacts dans LocalForage:', error);
    }
  },

  async addContact(newContact) {
    try {
      const contacts = await this.getStoredContacts();
      const updatedContacts = [...contacts, newContact];
      await this.storeContacts(updatedContacts);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du contact et de la sauvegarde dans LocalForage:', error);
    }
  },

  // User management
  async getUsers() {
    try {
      let users = await localforage.getItem(USERS_KEY);
      return users || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs depuis LocalForage:', error);
      return [];
    }
  },

  async addUser(newUser) {
    try {
      const users = await this.getUsers();
      const updatedUsers = [...users, newUser];
      await localforage.setItem(USERS_KEY, updatedUsers);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur et de la sauvegarde dans LocalForage:', error);
    }
  },

  async findUser(username, password) {
    try {
      const users = await this.getUsers();
      return users.find(user => user.username === username && user.password === password) || null;
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur dans LocalForage:', error);
      return null;
    }
  },

  async setCurrentUser(user) {
    try {
      await localforage.setItem(CURRENT_USER_KEY, user);
    } catch (error) {
      console.error('Erreur lors de la définition de l\'utilisateur actuel dans LocalForage:', error);
    }
  },

  async getCurrentUser() {
    try {
      const user = await localforage.getItem(CURRENT_USER_KEY);
      return user || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel depuis LocalForage:', error);
      return null;
    }
  },

  async clearCurrentUser() {
    try {
      await localforage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur actuel dans LocalForage:', error);
    }
  },
  
};

export default LocalForageService;
