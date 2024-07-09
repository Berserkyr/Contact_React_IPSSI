import localforage from 'localforage';

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: 'my_appointments',
});

const APPOINTMENTS_KEY = 'appointments';

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
};

export default LocalForageService;
