import { Lead } from '@/types/entity';
import { action, makeObservable, observable } from 'mobx';
import { userStore } from './userStore';
import { USER_ID } from '@/services/entityService';
import { getLeads } from '@/requests/entities';

class LeadStore {
  leads: Lead[] = [];

  constructor() {
    makeObservable(this, {
      leads: observable,
      setLeads: action,
    });
  }

  setLeads(leads: Lead[]) {
    this.leads = leads;
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    await this.assertLeadsAreLoaded();
    console.log(this.leads.slice());
    return this.leads.find(lead => lead.id === id);
  }

  async assertLeadsAreLoaded() {
    if (this.leads.length === 0) {
      await this.loadLeads();
    }
  }

  async loadLeads() {
    const userId = userStore.user?.id || USER_ID;
    const leads = await getLeads(userId);
    this.setLeads(leads);
  }
}

export const leadStore = new LeadStore();
