import { Lead } from '@/types/entity';
import { action, makeObservable, observable } from 'mobx';
import { getLeads } from '@/requests/entities';

class LeadStore {
  leads: Lead[] = [];

  constructor() {
    makeObservable(this, {
      leads: observable,
      setLeads: action,
      addLead: action,
    });
  }

  setLeads(leads: Lead[]) {
    this.leads = leads;
  }

  addLead(lead: Lead) {
    const idx = this.leads.findIndex(item => item.id === lead.id);
    if (idx === -1) {
      this.leads.push(lead);
    } else {
      this.leads[idx] = lead;
    }
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    await this.assertLeadsAreLoaded();
    return this.leads.find(lead => lead.id === id);
  }

  async assertLeadsAreLoaded() {
    if (this.leads.length === 0) {
      await this.loadLeads();
    }
  }

  async loadLeads() {
    const leads = await getLeads();
    this.setLeads(leads);
  }
}

export const leadStore = new LeadStore();
