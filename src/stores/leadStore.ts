import { Lead } from '@/types/entity';
import { makeAutoObservable } from 'mobx';

class LeadStore {
  leads: Lead[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setLeads(leads: Lead[]) {
    this.leads = leads;
  }

  getLeadById(id: string): Lead | undefined {
    return this.leads.find(lead => lead.id === id);
  }

  getLeads(): Lead[] {
    return this.leads;
  }
}

export const leadStore = new LeadStore();
