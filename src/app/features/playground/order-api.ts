import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SimulationMode } from '@core/http/model';
import { SIMULATION_MODE } from '@core/http/simulation-mode';
import { Order } from './order';

@Service()
export class OrderApi {
  readonly #http = inject(HttpClient);

  save(order: Order, mode: SimulationMode = 'success'): Promise<Order> {
    return firstValueFrom(
      this.#http.post<Order>('/order/save', order, {
        context: new HttpContext().set(SIMULATION_MODE, mode),
      }),
    );
  }
}
