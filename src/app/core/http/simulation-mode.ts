import { HttpContextToken } from '@angular/common/http';
import { EmailSimulationMode, SimulationMode, VatSimulationMode } from './model';

export const SIMULATION_MODE = new HttpContextToken<SimulationMode>(() => 'success');

export const VAT_SIMULATION_MODE = new HttpContextToken<VatSimulationMode>(() => 'valid');

export const EMAIL_SIMULATION_MODE = new HttpContextToken<EmailSimulationMode>(() => 'allowed');
