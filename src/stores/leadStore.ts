import { Lead } from '@/types/entity';
import { action, makeObservable, observable } from 'mobx';

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

  getLeadById(id: string): Lead | undefined {
    return this.leads.find(lead => lead.id === id);
  }
}

export const leadStore = new LeadStore();
